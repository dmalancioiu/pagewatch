'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateMonitoredUrl } from '@/lib/actions/websites'
import { triggerManualRun } from '@/lib/actions/run-now'
import { useToast } from '@/components/ui/ToastProvider'

type Zone = {
  id?: string
  x: number
  y: number
  width: number
  height: number
  label?: string
  instruction?: string
  sensitivity?: 'low' | 'normal' | 'high'
}

type Props = {
  monitorId: string
  initialIsActive: boolean
  hasOpenAlert: boolean
  initialCheckFrequency: 'hourly' | 'daily' | 'weekly'
  initialCheckHour: number | null
  initialFullPage: boolean
  initialWatchDescription: string | null
  initialZones: Zone[]
}

type ActionKey =
  | 'run-now'
  | 'pause-resume'
  | 'settings'
  | 'schedule'
  | 'capture'
  | 'instruction'
  | `zone-${string}`

function normaliseZones(zones: Zone[]) {
  return zones.map((zone, index) => ({
    id: zone.id ?? `zone-${index + 1}`,
    x: zone.x,
    y: zone.y,
    width: zone.width,
    height: zone.height,
    label: zone.label ?? `Zone ${index + 1}`,
    instruction: zone.instruction ?? '',
    sensitivity: zone.sensitivity ?? 'normal',
  }))
}

function sectionByLabel(inspector: Element, keyword: string) {
  return Array.from(inspector.querySelectorAll('section')).find((section) =>
    section.querySelector('label')?.textContent?.toLowerCase().includes(keyword.toLowerCase())
  ) as HTMLElement | undefined
}

function esc(value: string | null | undefined) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}

export function MonitorSettingsRailSync({
  monitorId,
  initialIsActive,
  hasOpenAlert,
  initialCheckFrequency,
  initialCheckHour,
  initialFullPage,
  initialWatchDescription,
  initialZones,
}: Props) {
  const router = useRouter()
  const toast = useToast()
  const [isActive, setIsActive] = useState(initialIsActive)
  const [checkFrequency, setCheckFrequency] = useState(initialCheckFrequency)
  const [checkHour, setCheckHour] = useState(initialCheckHour ?? 10)
  const [fullPage, setFullPage] = useState(initialFullPage)
  const [watchDescription, setWatchDescription] = useState(initialWatchDescription ?? '')
  const [zones, setZones] = useState(() => normaliseZones(initialZones))
  const [loadingAction, setLoadingAction] = useState<ActionKey | null>(null)
  const [, startTransition] = useTransition()

  const payload = useMemo(() => ({ checkFrequency, checkHour, fullPage, watchDescription, zones }), [checkFrequency, checkHour, fullPage, watchDescription, zones])

  function publishZones(nextZones: Zone[], source = 'settings-rail') {
    window.dispatchEvent(new CustomEvent('pagewatch:zones-updated', {
      detail: { zones: nextZones, source },
    }))
  }

  function save(updates?: Record<string, any>, success = 'Settings saved', action: ActionKey = 'settings') {
    setLoadingAction(action)
    startTransition(async () => {
      try {
        await updateMonitoredUrl(monitorId, updates ?? {
          check_frequency: payload.checkFrequency,
          check_hour: payload.checkHour,
          full_page: payload.fullPage,
          watch_description: payload.watchDescription,
          zones: payload.zones,
        })
        toast.success(success)
        router.refresh()
      } catch (error) {
        console.error(error)
        toast.error('Could not save changes', errorMessage(error))
      } finally {
        setLoadingAction(null)
      }
    })
  }

  function saveZones(nextZones: typeof zones, success = 'Zones saved', action: ActionKey = 'settings') {
    setZones(nextZones)
    publishZones(nextZones)
    save({ zones: nextZones }, success, action)
  }

  useEffect(() => {
    function handleExternalZones(event: Event) {
      const detail = (event as CustomEvent<{ zones?: Zone[]; source?: string }>).detail
      if (!Array.isArray(detail?.zones) || detail.source === 'settings-rail') return
      setZones(normaliseZones(detail.zones))
    }

    window.addEventListener('pagewatch:zones-updated', handleExternalZones)
    return () => window.removeEventListener('pagewatch:zones-updated', handleExternalZones)
  }, [])

  useEffect(() => {
    const topbar = document.querySelector('.md-topbar')
    if (!topbar) return

    const buttons = Array.from(topbar.querySelectorAll<HTMLButtonElement>('button'))
    const runButton = buttons.find((button) => {
      const text = button.textContent?.trim().toLowerCase() ?? ''
      return text.includes('run now') || button.dataset.monitorRunNow === 'true'
    })
    const pauseButton = buttons.find((button) => {
      const text = button.textContent?.trim().toLowerCase() ?? ''
      return text.includes('pause') || text.includes('resume') || button.dataset.monitorPauseResume === 'true'
    })
    const statusChip = topbar.querySelector<HTMLElement>('.md-crumbs em')
    const status = !isActive ? 'Paused' : hasOpenAlert ? 'Alert' : 'Healthy'

    if (runButton) {
      const running = loadingAction === 'run-now'
      runButton.dataset.monitorRunNow = 'true'
      runButton.disabled = running || !isActive
      runButton.innerHTML = running
        ? 'Queueing...'
        : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12A10 10 0 1 1 12 2"></path><path d="M22 2v10h-10"></path></svg>Run Now'
      runButton.title = isActive ? 'Run this monitor now' : 'Resume this monitor before running it manually'
      runButton.onclick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (!isActive || loadingAction) return
        setLoadingAction('run-now')
        toast.info('Manual check queued', 'PageWatch will capture and compare this monitor shortly.')
        startTransition(async () => {
          try {
            await triggerManualRun(monitorId)
            toast.success('Manual check started', 'Refresh in a moment to see the latest capture and any relevant alert.')
            router.refresh()
          } catch (error) {
            console.error(error)
            toast.error('Could not start manual check', errorMessage(error))
          } finally {
            setLoadingAction(null)
          }
        })
      }
    }

    if (pauseButton) {
      const saving = loadingAction === 'pause-resume'
      pauseButton.dataset.monitorPauseResume = 'true'
      pauseButton.disabled = saving
      pauseButton.innerHTML = saving
        ? isActive ? 'Pausing...' : 'Resuming...'
        : isActive
          ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="4" width="4" height="16" rx="1"></rect><rect x="6" y="4" width="4" height="16" rx="1"></rect></svg>Pause'
          : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>Resume'
      pauseButton.onclick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (loadingAction) return
        const next = !isActive
        setLoadingAction('pause-resume')
        startTransition(async () => {
          try {
            await updateMonitoredUrl(monitorId, { is_active: next } as any)
            setIsActive(next)
            toast.success(next ? 'Monitor resumed' : 'Monitor paused')
            router.refresh()
          } catch (error) {
            console.error(error)
            toast.error('Could not update monitor', errorMessage(error))
          } finally {
            setLoadingAction(null)
          }
        })
      }
    }

    if (statusChip) {
      statusChip.className = status.toLowerCase()
      statusChip.innerHTML = `<i></i>${status}`
    }
  }, [monitorId, isActive, loadingAction, hasOpenAlert, router, toast])

  useEffect(() => {
    const inspector = document.querySelector('.md-inspector')
    if (!inspector) return

    const styleId = 'monitor-settings-rail-sync-style'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        .msr-control-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px}.msr-input{height:28px;border:1px solid #E5E7EB;border-radius:7px;padding:0 8px;font-size:11px;font-family:inherit;color:#111827;background:white;outline:none}.msr-input:focus{border-color:rgba(37,99,235,.45);box-shadow:0 0 0 3px rgba(37,99,235,.08)}.msr-toggle{position:relative;width:36px;height:20px;border-radius:99px;border:0;background:#D1D5DB;cursor:pointer;flex-shrink:0}.msr-toggle.on{background:#2563EB}.msr-toggle i{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:white;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:left .2s}.msr-toggle.on i{left:18px}.msr-zone-card{padding:8px;border:1px solid #E5E7EB;border-radius:8px;background:#FAFAFA;margin-bottom:8px}.msr-zone-head{display:flex;align-items:center;gap:6px;margin-bottom:7px}.msr-zone-dot{width:8px;height:8px;border-radius:50%;background:#2563EB;flex-shrink:0}.msr-zone-head input{flex:1;height:25px;border:1px solid transparent;background:transparent;border-radius:6px;padding:0 5px;font-size:11.5px;font-weight:700;color:#111827;outline:none}.msr-zone-head input:focus{background:white;border-color:#E5E7EB}.msr-remove{width:22px;height:22px;border-radius:5px;border:1px solid #E5E7EB;background:white;color:#EF4444;cursor:pointer;font-size:13px;line-height:1}.msr-remove:hover{background:#FEF2F2;border-color:#FECACA}.msr-zone-prompt{width:100%;min-height:64px;resize:vertical;border:1px solid #E5E7EB;border-radius:7px;background:white;padding:7px;font-size:11px;line-height:1.45;color:#374151;font-family:inherit;outline:none;margin-bottom:6px}.msr-zone-prompt:focus{border-color:rgba(37,99,235,.45);box-shadow:0 0 0 3px rgba(37,99,235,.08)}.msr-zone-save{height:24px;border:1px solid #E5E7EB;border-radius:6px;background:white;color:#374151;font-size:10.5px;font-weight:500;padding:0 8px;cursor:pointer}.msr-zone-save:hover{background:#F9FAFB}.msr-empty{font-size:11px;color:#9CA3AF;margin:0 0 8px}.msr-btn{width:100%;height:28px;display:flex;align-items:center;justify-content:center;border:1px solid #E5E7EB;background:white;border-radius:8px;font-size:11px;font-weight:500;color:#374151;cursor:pointer}.msr-btn:hover{background:#F9FAFB}.msr-btn.primary{background:#2563EB;color:white;border-color:#2563EB}.msr-btn:disabled,.msr-zone-save:disabled,.msr-toggle:disabled{opacity:.65;cursor:wait}.msr-textarea{width:100%;min-height:82px;resize:vertical;border:1px solid #E5E7EB;border-radius:8px;padding:8px;font-size:11.5px;line-height:1.5;color:#374151;font-family:inherit;outline:none;margin-bottom:8px}.msr-textarea:focus{border-color:rgba(37,99,235,.45);box-shadow:0 0 0 3px rgba(37,99,235,.08)}.msr-hint{font-size:10px;line-height:1.45;color:#9CA3AF;margin:0 0 8px}
      `
      document.head.appendChild(style)
    }

    const saveButton = inspector.querySelector('.md-inspector-save button') as HTMLButtonElement | null
    if (saveButton) {
      const saving = loadingAction === 'settings'
      saveButton.disabled = saving
      saveButton.textContent = saving ? 'Saving...' : 'Save'
      saveButton.onclick = () => save(undefined, 'Settings saved', 'settings')
    }

    const scheduleSection = sectionByLabel(inspector, 'schedule')
    if (scheduleSection) {
      const saving = loadingAction === 'schedule'
      scheduleSection.innerHTML = `
        <label>▣ Schedule</label>
        <div class="md-freq">
          <button data-freq="hourly" class="${checkFrequency === 'hourly' ? 'active' : ''}" ${saving ? 'disabled' : ''}>Hourly</button>
          <button data-freq="daily" class="${checkFrequency === 'daily' ? 'active' : ''}" ${saving ? 'disabled' : ''}>Daily</button>
          <button data-freq="weekly" class="${checkFrequency === 'weekly' ? 'active' : ''}" ${saving ? 'disabled' : ''}>Weekly</button>
        </div>
        <div class="msr-control-row"><span style="font-size:11px;color:#6B7280;font-weight:500">Run at (UTC)</span><select class="msr-input" data-check-hour ${saving ? 'disabled' : ''}>${Array.from({ length: 24 }, (_, hour) => `<option value="${hour}" ${hour === checkHour ? 'selected' : ''}>${String(hour).padStart(2, '0')}:00</option>`).join('')}</select></div>
      `
      scheduleSection.querySelectorAll<HTMLButtonElement>('[data-freq]').forEach((button) => {
        button.onclick = () => {
          const next = button.dataset.freq as 'hourly' | 'daily' | 'weekly'
          setCheckFrequency(next)
          save({ check_frequency: next, check_hour: checkHour }, 'Schedule saved', 'schedule')
        }
      })
      const hourSelect = scheduleSection.querySelector<HTMLSelectElement>('[data-check-hour]')
      if (hourSelect) {
        hourSelect.onchange = () => {
          const next = Number(hourSelect.value)
          setCheckHour(next)
          save({ check_frequency: checkFrequency, check_hour: next }, 'Schedule saved', 'schedule')
        }
      }
    }

    const captureSection = sectionByLabel(inspector, 'capture')
    if (captureSection) {
      const saving = loadingAction === 'capture'
      captureSection.innerHTML = `
        <label>▣ Capture</label>
        <div class="msr-control-row"><div><b style="display:block;font-size:12px;font-weight:600;color:#111827">Full page scroll</b><span style="font-size:10px;color:#9CA3AF">Capture entire page height</span></div><button class="msr-toggle ${fullPage ? 'on' : ''}" data-full-page ${saving ? 'disabled' : ''}><i></i></button></div>
        <p class="msr-hint">Cookie banners are always dismissed automatically before capture.</p>
      `
      const toggle = captureSection.querySelector<HTMLButtonElement>('[data-full-page]')
      if (toggle) {
        toggle.onclick = () => {
          const next = !fullPage
          setFullPage(next)
          save({ full_page: next }, 'Capture saved', 'capture')
        }
      }
    }

    const zonesSection = sectionByLabel(inspector, 'zones')
    if (zonesSection) {
      zonesSection.innerHTML = `
        <label>▣ Zones</label>
        <p class="msr-hint">Each zone can have its own prompt. The LLM receives these as zone-specific instructions.</p>
        <div data-zone-list>
          ${zones.length ? zones.map((zone, index) => {
            const zoneKey = `zone-${zone.id}`
            const saving = loadingAction === zoneKey
            return `
              <div class="msr-zone-card" data-zone-id="${esc(zone.id)}">
                <div class="msr-zone-head"><i class="msr-zone-dot" style="background:${index === 0 ? '#2563EB' : '#16A34A'}"></i><input data-zone-label="${esc(zone.id)}" value="${esc(zone.label || `Zone ${index + 1}`)}" /><button class="msr-remove" data-remove-zone="${esc(zone.id)}" title="Remove zone" ${saving ? 'disabled' : ''}>×</button></div>
                <textarea class="msr-zone-prompt" data-zone-prompt="${esc(zone.id)}" placeholder="Prompt for this zone, e.g. Only alert me if pricing or CTA text changes…">${esc(zone.instruction || '')}</textarea>
                <button class="msr-zone-save" data-save-zone="${esc(zone.id)}" ${saving ? 'disabled' : ''}>${saving ? 'Saving...' : 'Save zone prompt'}</button>
              </div>
            `
          }).join('') : '<p class="msr-empty">No custom zones yet. The main AI instruction below applies to the whole page.</p>'}
        </div>
        <button class="msr-btn" data-open-zone-editor>+ Add zone</button>
      `
      zonesSection.querySelectorAll<HTMLButtonElement>('[data-remove-zone]').forEach((button) => {
        button.onclick = () => saveZones(zones.filter((zone) => zone.id !== button.dataset.removeZone), 'Zone removed', `zone-${button.dataset.removeZone ?? 'unknown'}`)
      })
      zonesSection.querySelectorAll<HTMLButtonElement>('[data-save-zone]').forEach((button) => {
        button.onclick = () => {
          const id = button.dataset.saveZone
          const label = zonesSection.querySelector<HTMLInputElement>(`[data-zone-label="${CSS.escape(id ?? '')}"]`)?.value ?? ''
          const instruction = zonesSection.querySelector<HTMLTextAreaElement>(`[data-zone-prompt="${CSS.escape(id ?? '')}"]`)?.value ?? ''
          saveZones(zones.map((zone) => zone.id === id ? { ...zone, label, instruction } : zone), 'Zone prompt saved', `zone-${id ?? 'unknown'}`)
        }
      })
      const addZoneButton = zonesSection.querySelector<HTMLButtonElement>('[data-open-zone-editor]')
      if (addZoneButton) {
        addZoneButton.onclick = () => {
          const zoneTab = Array.from(document.querySelectorAll<HTMLButtonElement>('.md-viewer-header button')).find((button) => button.textContent?.toLowerCase().includes('zone editor'))
          zoneTab?.click()
        }
      }
    }

    const aiSection = sectionByLabel(inspector, 'ai instruction')
    if (aiSection) {
      const saving = loadingAction === 'instruction'
      aiSection.innerHTML = `
        <label>ⓘ Main AI instruction</label>
        <p class="msr-hint">Used for full-page monitoring and as fallback context when a zone has no prompt.</p>
        <textarea class="msr-textarea" data-watch-description placeholder="General page-level prompt…">${esc(watchDescription)}</textarea>
        <button class="msr-btn" data-update-instruction ${saving ? 'disabled' : ''}>${saving ? 'Saving...' : 'Update instruction'}</button>
      `
      const textarea = aiSection.querySelector<HTMLTextAreaElement>('[data-watch-description]')
      if (textarea) textarea.oninput = () => setWatchDescription(textarea.value)
      const updateButton = aiSection.querySelector<HTMLButtonElement>('[data-update-instruction]')
      if (updateButton) updateButton.onclick = () => save({ watch_description: textarea?.value ?? '' }, 'Instruction saved', 'instruction')
    }
  }, [checkFrequency, checkHour, fullPage, watchDescription, zones, loadingAction, toast])

  return null
}

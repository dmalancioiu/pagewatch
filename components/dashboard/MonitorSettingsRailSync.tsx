'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateMonitoredUrl } from '@/lib/actions/websites'

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
  initialCheckFrequency: 'hourly' | 'daily' | 'weekly'
  initialCheckHour: number | null
  initialFullPage: boolean
  initialWatchDescription: string | null
  initialZones: Zone[]
}

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

export function MonitorSettingsRailSync({
  monitorId,
  initialCheckFrequency,
  initialCheckHour,
  initialFullPage,
  initialWatchDescription,
  initialZones,
}: Props) {
  const router = useRouter()
  const [checkFrequency, setCheckFrequency] = useState(initialCheckFrequency)
  const [checkHour, setCheckHour] = useState(initialCheckHour ?? 10)
  const [fullPage, setFullPage] = useState(initialFullPage)
  const [watchDescription, setWatchDescription] = useState(initialWatchDescription ?? '')
  const [zones, setZones] = useState(() => normaliseZones(initialZones))
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const payload = useMemo(() => ({ checkFrequency, checkHour, fullPage, watchDescription, zones }), [checkFrequency, checkHour, fullPage, watchDescription, zones])

  function save(updates?: Record<string, any>, success = 'Saved') {
    setMessage('Saving...')
    startTransition(async () => {
      try {
        await updateMonitoredUrl(monitorId, updates ?? {
          check_frequency: payload.checkFrequency,
          check_hour: payload.checkHour,
          full_page: payload.fullPage,
          watch_description: payload.watchDescription,
          zones: payload.zones,
        })
        setMessage(success)
        router.refresh()
      } catch (error) {
        console.error(error)
        setMessage('Could not save')
      }
    })
  }

  useEffect(() => {
    const inspector = document.querySelector('.md-inspector')
    if (!inspector) return

    const styleId = 'monitor-settings-rail-sync-style'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        .msr-msg{font-size:10px;color:#6B7280;margin-top:6px;text-align:right}.msr-control-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px}.msr-input{height:28px;border:1px solid #E5E7EB;border-radius:7px;padding:0 8px;font-size:11px;font-family:inherit;color:#111827;background:white;outline:none}.msr-input:focus{border-color:rgba(37,99,235,.45);box-shadow:0 0 0 3px rgba(37,99,235,.08)}.msr-toggle{position:relative;width:36px;height:20px;border-radius:99px;border:0;background:#D1D5DB;cursor:pointer;flex-shrink:0}.msr-toggle.on{background:#2563EB}.msr-toggle i{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:white;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:left .2s}.msr-toggle.on i{left:18px}.msr-zone-row{display:flex;align-items:center;gap:6px;padding:6px 8px;border:1px solid #E5E7EB;border-radius:6px;background:#FAFAFA;margin-bottom:5px}.msr-zone-dot{width:8px;height:8px;border-radius:50%;background:#2563EB;flex-shrink:0}.msr-zone-main{flex:1;min-width:0}.msr-zone-main b{display:block;font-size:11.5px;color:#111827}.msr-zone-main span{display:block;font-size:10px;color:#9CA3AF;margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.msr-remove{width:22px;height:22px;border-radius:5px;border:1px solid #E5E7EB;background:white;color:#EF4444;cursor:pointer;font-size:13px;line-height:1}.msr-remove:hover{background:#FEF2F2;border-color:#FECACA}.msr-empty{font-size:11px;color:#9CA3AF;margin:0 0 8px}.msr-btn{width:100%;height:28px;display:flex;align-items:center;justify-content:center;border:1px solid #E5E7EB;background:white;border-radius:8px;font-size:11px;font-weight:500;color:#374151;cursor:pointer}.msr-btn:hover{background:#F9FAFB}.msr-btn.primary{background:#2563EB;color:white;border-color:#2563EB}.msr-btn.primary:hover{background:#1D4ED8}.msr-btn:disabled{opacity:.65;cursor:wait}.msr-textarea{width:100%;min-height:82px;resize:vertical;border:1px solid #E5E7EB;border-radius:8px;padding:8px;font-size:11.5px;line-height:1.5;color:#374151;font-family:inherit;outline:none;margin-bottom:8px}.msr-textarea:focus{border-color:rgba(37,99,235,.45);box-shadow:0 0 0 3px rgba(37,99,235,.08)}
      `
      document.head.appendChild(style)
    }

    const saveButton = inspector.querySelector('.md-inspector-save button') as HTMLButtonElement | null
    if (saveButton) {
      saveButton.disabled = isPending
      saveButton.textContent = isPending ? 'Saving...' : 'Save'
      saveButton.onclick = () => save(undefined, 'Settings saved')
    }

    const scheduleSection = sectionByLabel(inspector, 'schedule')
    if (scheduleSection) {
      scheduleSection.innerHTML = `
        <label>▣ Schedule</label>
        <div class="md-freq">
          <button data-freq="hourly" class="${checkFrequency === 'hourly' ? 'active' : ''}">Hourly</button>
          <button data-freq="daily" class="${checkFrequency === 'daily' ? 'active' : ''}">Daily</button>
          <button data-freq="weekly" class="${checkFrequency === 'weekly' ? 'active' : ''}">Weekly</button>
        </div>
        <div class="msr-control-row">
          <span style="font-size:11px;color:#6B7280;font-weight:500">Run at (UTC)</span>
          <select class="msr-input" data-check-hour>
            ${Array.from({ length: 24 }, (_, hour) => `<option value="${hour}" ${hour === checkHour ? 'selected' : ''}>${String(hour).padStart(2, '0')}:00</option>`).join('')}
          </select>
        </div>
        <div class="msr-msg">${message}</div>
      `
      scheduleSection.querySelectorAll<HTMLButtonElement>('[data-freq]').forEach((button) => {
        button.onclick = () => {
          const next = button.dataset.freq as 'hourly' | 'daily' | 'weekly'
          setCheckFrequency(next)
          save({ check_frequency: next, check_hour: checkHour }, 'Schedule saved')
        }
      })
      const hourSelect = scheduleSection.querySelector<HTMLSelectElement>('[data-check-hour]')
      if (hourSelect) {
        hourSelect.onchange = () => {
          const next = Number(hourSelect.value)
          setCheckHour(next)
          save({ check_frequency: checkFrequency, check_hour: next }, 'Schedule saved')
        }
      }
    }

    const captureSection = sectionByLabel(inspector, 'capture')
    if (captureSection) {
      captureSection.innerHTML = `
        <label>▣ Capture</label>
        <div class="msr-control-row">
          <div><b style="display:block;font-size:12px;font-weight:600;color:#111827">Full page scroll</b><span style="font-size:10px;color:#9CA3AF">Capture entire page height</span></div>
          <button class="msr-toggle ${fullPage ? 'on' : ''}" data-full-page><i></i></button>
        </div>
        <p style="font-size:10px;color:#9CA3AF;margin:10px 0 0">Cookie banners are always dismissed automatically before capture.</p>
      `
      const toggle = captureSection.querySelector<HTMLButtonElement>('[data-full-page]')
      if (toggle) {
        toggle.onclick = () => {
          const next = !fullPage
          setFullPage(next)
          save({ full_page: next }, 'Capture saved')
        }
      }
    }

    const zonesSection = sectionByLabel(inspector, 'zones')
    if (zonesSection) {
      zonesSection.innerHTML = `
        <label>▣ Zones</label>
        <div data-zone-list>
          ${zones.length ? zones.map((zone, index) => `
            <div class="msr-zone-row" data-zone-id="${zone.id}">
              <i class="msr-zone-dot" style="background:${index === 0 ? '#2563EB' : '#16A34A'}"></i>
              <div class="msr-zone-main"><b>${zone.label || `Zone ${index + 1}`}</b><span>${zone.instruction || zone.sensitivity || 'Visual changes'}</span></div>
              <button class="msr-remove" data-remove-zone="${zone.id}" title="Remove zone">×</button>
            </div>
          `).join('') : '<p class="msr-empty">No custom zones yet.</p>'}
        </div>
        <button class="msr-btn" data-open-zone-editor>+ Add zone</button>
      `
      zonesSection.querySelectorAll<HTMLButtonElement>('[data-remove-zone]').forEach((button) => {
        button.onclick = () => {
          const next = zones.filter((zone) => zone.id !== button.dataset.removeZone)
          setZones(next)
          save({ zones: next }, 'Zone removed')
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
      aiSection.innerHTML = `
        <label>ⓘ AI instruction</label>
        <textarea class="msr-textarea" data-watch-description>${watchDescription}</textarea>
        <button class="msr-btn" data-update-instruction ${isPending ? 'disabled' : ''}>${isPending ? 'Saving...' : 'Update instruction'}</button>
      `
      const textarea = aiSection.querySelector<HTMLTextAreaElement>('[data-watch-description]')
      if (textarea) textarea.oninput = () => setWatchDescription(textarea.value)
      const updateButton = aiSection.querySelector<HTMLButtonElement>('[data-update-instruction]')
      if (updateButton) {
        updateButton.onclick = () => save({ watch_description: textarea?.value ?? '' }, 'Instruction saved')
      }
    }
  }, [checkFrequency, checkHour, fullPage, watchDescription, zones, isPending, message])

  return null
}

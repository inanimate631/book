import { useEffect, useRef, useState } from 'react'
import { getNovaPoshtaWarehouses, searchNovaPoshtaCities } from '../services/novaPoshtaService'
import type { NovaPoshtaOption } from '../services/novaPoshtaService'

export type NovaPoshtaSelection = {
  city: NovaPoshtaOption | null
  warehouse: NovaPoshtaOption | null
}

type NovaPoshtaFieldsProps = {
  value: NovaPoshtaSelection
  onChange: (value: NovaPoshtaSelection) => void
}

export function NovaPoshtaFields({ value, onChange }: NovaPoshtaFieldsProps) {
  const [citySearch, setCitySearch] = useState(value.city?.label ?? '')
  const [cityOptions, setCityOptions] = useState<NovaPoshtaOption[]>([])
  const [warehouseOptions, setWarehouseOptions] = useState<NovaPoshtaOption[]>([])
  const [cityOpen, setCityOpen] = useState(false)
  const [warehouseOpen, setWarehouseOpen] = useState(false)
  const [isLoadingCities, setLoadingCities] = useState(false)
  const [isLoadingWarehouses, setLoadingWarehouses] = useState(false)
  const [loadError, setLoadError] = useState('')
  const cityRequest = useRef(0)
  const warehouseRequest = useRef(0)
  const fieldsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (fieldsRef.current && !fieldsRef.current.contains(event.target as Node)) {
        setCityOpen(false)
        setWarehouseOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setCityOpen(false)
        setWarehouseOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    const search = citySearch.trim()
    if (value.city?.label === search || search.length < 2) return

    const requestId = ++cityRequest.current
    const timer = window.setTimeout(async () => {
      setLoadingCities(true)
      setLoadError('')
      try {
        const cities = await searchNovaPoshtaCities(search)
        if (requestId === cityRequest.current) setCityOptions(cities)
      } catch (error) {
        if (requestId === cityRequest.current) {
          setCityOptions([])
          setLoadError(error instanceof Error ? error.message : 'Помилка завантаження міст')
        }
      } finally {
        if (requestId === cityRequest.current) setLoadingCities(false)
      }
    }, 300)

    return () => window.clearTimeout(timer)
  }, [citySearch, value.city?.label])

  useEffect(() => {
    if (!value.city?.ref) return

    const requestId = ++warehouseRequest.current
    getNovaPoshtaWarehouses(value.city.ref)
      .then((warehouses) => {
        if (requestId === warehouseRequest.current) setWarehouseOptions(warehouses)
      })
      .catch((error: unknown) => {
        if (requestId === warehouseRequest.current) {
          setWarehouseOptions([])
          setLoadError(error instanceof Error ? error.message : 'Помилка завантаження відділень')
        }
      })
      .finally(() => {
        if (requestId === warehouseRequest.current) setLoadingWarehouses(false)
      })
  }, [value.city?.ref])

  function selectCity(city: NovaPoshtaOption) {
    setCitySearch(city.label)
    setCityOptions([])
    setCityOpen(false)
    setWarehouseOpen(false)
    setWarehouseOptions([])
    setLoadingWarehouses(true)
    setLoadError('')
    onChange({ city, warehouse: null })
  }

  function selectWarehouse(warehouse: NovaPoshtaOption) {
    setWarehouseOpen(false)
    onChange({ ...value, warehouse })
  }

  return (
    <div className="nova-poshta-fields" ref={fieldsRef}>
      <label className="nova-field">
        <span>МІСТО</span>
        <div className="nova-combobox">
          <input
            value={citySearch}
            placeholder="Почніть вводити місто"
            autoComplete="off"
            role="combobox"
            aria-expanded={cityOpen}
            aria-controls="nova-city-options"
            onFocus={() => setCityOpen(cityOptions.length > 0)}
            onChange={(event) => {
              setCitySearch(event.target.value)
              setCityOptions([])
              setCityOpen(true)
              setWarehouseOpen(false)
              setLoadError('')
              if (value.city) {
                setWarehouseOptions([])
                setLoadingWarehouses(false)
                onChange({ city: null, warehouse: null })
              }
            }}
          />
          {cityOpen && (cityOptions.length > 0 || isLoadingCities) && (
            <div className="nova-options" id="nova-city-options" role="listbox">
              {isLoadingCities && <span className="nova-option nova-option--status">ЗАВАНТАЖЕННЯ...</span>}
              {cityOptions.map((city) => (
                <button className="nova-option" type="button" role="option" key={city.ref} onClick={() => selectCity(city)}>
                  {city.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </label>

      <label className="nova-field">
        <span>ВІДДІЛЕННЯ</span>
        <div className="nova-combobox">
          <button
            className="nova-warehouse-trigger"
            type="button"
            disabled={!value.city || isLoadingWarehouses}
            aria-expanded={warehouseOpen}
            onClick={() => setWarehouseOpen((open) => !open)}
          >
            <span>{isLoadingWarehouses ? 'ЗАВАНТАЖЕННЯ...' : value.warehouse?.label ?? (value.city ? 'Оберіть відділення' : 'Спочатку оберіть місто')}</span>
            <span className="select-chevron" aria-hidden="true" />
          </button>
          {warehouseOpen && warehouseOptions.length > 0 && (
            <div className="nova-options" role="listbox">
              {warehouseOptions.map((warehouse) => (
                <button className="nova-option" type="button" role="option" key={warehouse.ref} onClick={() => selectWarehouse(warehouse)}>
                  {warehouse.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </label>

      {loadError && <p className="nova-error">{loadError}</p>}
      <input type="hidden" name="city" value={value.city?.label ?? ''} />
      <input type="hidden" name="cityRef" value={value.city?.ref ?? ''} />
      <input type="hidden" name="warehouse" value={value.warehouse?.label ?? ''} />
      <input type="hidden" name="warehouseRef" value={value.warehouse?.ref ?? ''} />
      <input type="hidden" name="address" value={value.warehouse ? `${value.city?.label}, ${value.warehouse.label}` : ''} />
    </div>
  )
}

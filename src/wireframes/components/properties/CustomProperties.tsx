import { Button, Checkbox, Col, InputNumber, Row, Select, message } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { Color, ColorPalette, ColorPicker, useEventCallback } from '@app/core'
import { useAppDispatch } from '@app/store'
import {
  changeItemsAppearance,
  changeScale,
  ColorConfigurable,
  Configurable,
  getColors,
  getDiagramId,
  getEditor,
  getSelection,
  NumberConfigurable,
  removeItems,
  selectColorTab,
  SelectionConfigurable,
  SliderConfigurable,
  TextConfigurable,
  ToggleConfigurable,
  useStore
} from '@app/wireframes/model'
import { CustomSlider } from './CustomSlider'
import { Text } from './Text'
import './Custom.scss'

interface CustomPropertyProps {
  // The configurable.
  configurable: Configurable

  // The appearance value.
  value: any

  // The selected color tab.
  selectedColorTab: string

  // The recent colors.
  recentColors: ColorPalette

  // When the value has changed.
  onChange: (name: string, value: any) => void

  // The color tab has changed.
  onColorTabChange: (key: string) => void
}

export const CustomProperty = (props: CustomPropertyProps) => {
  const {
    configurable,
    onChange,
    onColorTabChange,
    recentColors,
    selectedColorTab,
    value
  } = props

  const selectionSetId = useStore(getSelection).selectedItems
  const selectedDiagramId = useStore(getDiagramId)
  const dispatch = useAppDispatch()

  const editor = useStore(getEditor)

  const selectUnits = (
    <Select defaultValue="meter" style={{ width: 80 }}>
      <Select.Option value="meter">m</Select.Option>
      <Select.Option value="kilometer">km</Select.Option>
      <Select.Option value="inch">in</Select.Option>
      <Select.Option value="foot">ft</Select.Option>
    </Select>
  )

  const doSetScale = useEventCallback(() => {
    if (selectionSetId.length === 1 && selectedDiagramId) {
      dispatch(removeItems(selectedDiagramId, selectionSetId))
    }

    const scale = editor.scale

    message.success(`set scale of editor successfully${scale}`)
  })

  const doChangeValue = useEventCallback((newValue: any) => {
    onChange(configurable.name, newValue)
  })

  const doChangeColor = useEventCallback((color: Color) => {
    onChange(configurable.name, color.toNumber())
  })

  const doChangeBoolean = useEventCallback((event: CheckboxChangeEvent) => {
    onChange(configurable.name, event.target.checked)
  })

  return (
    <Row className="property">
      {configurable.label !== 'Length' && (
        <Col span={8} className="property-label">
          {configurable.label}
        </Col>
      )}
      <Col span={16} className="property-value">
        {configurable instanceof SliderConfigurable && (
          <CustomSlider
            value={value}
            min={configurable.min}
            max={configurable.max}
            onChange={doChangeValue}
          />
        )}

        {configurable instanceof NumberConfigurable && (
          <InputNumber
            addonBefore={selectUnits}
            value={value}
            min={configurable.min}
            max={configurable.max}
            onChange={doChangeValue}
          />
        )}

        {configurable instanceof TextConfigurable && (
          <Text text={value} onTextChange={doChangeValue} />
        )}

        {configurable instanceof ToggleConfigurable && (
          <Checkbox checked={value} onChange={doChangeBoolean} />
        )}

        {configurable instanceof SelectionConfigurable && (
          <Select value={value} onChange={doChangeValue}>
            {configurable.options.map((o) => (
              <Select.Option key={o} value={o}>
                {o}
              </Select.Option>
            ))}
          </Select>
        )}

        {configurable instanceof ColorConfigurable && (
          <ColorPicker
            activeColorTab={selectedColorTab as any}
            value={value}
            onChange={doChangeColor}
            onActiveColorTabChanged={onColorTabChange}
            recentColors={recentColors}
          />
        )}
      </Col>
      {configurable.label == 'Length' && (
        <Col span={8} className="property-label">
          <Button type="primary" onClick={() => doSetScale()}>
            confirm
          </Button>
        </Col>
      )}
    </Row>
  )
}

export const CustomProperties = () => {
  const dispatch = useAppDispatch()
  const recentColors = useStore(getColors)
  const selectedDiagramId = useStore(getDiagramId)
  const selectedColorTab = useStore((s) => s.ui.selectedColorTab)
  const selectionSet = useStore(getSelection)

  const doSelectColorTab = useEventCallback((key: string) => {
    dispatch(selectColorTab(key))
  })

  const doChange = useEventCallback((key: string, value: any) => {
    if (selectedDiagramId) {
      const selectedLine = selectionSet.cachedSelectedItems?.find(
        (item) => item.values.renderer === 'HorizontalLine'
      )
      // 如果item为horizontal line，计算editor比例尺
      if (selectedLine) {
        const scale = value / selectedLine.values.transform.size.x
        console.log(scale, '<---the scale of editor')
        dispatch(changeScale(scale))
      }
      dispatch(
        changeItemsAppearance(
          selectedDiagramId,
          selectionSet.selectedItems,
          key,
          value
        )
      )
    }
  })

  if (selectionSet.selectedItems.length !== 1 || !selectedDiagramId) {
    return null
  }

  const selectedShape = selectionSet.selectedItems[0]

  if (!selectedShape.configurables) {
    return null
  }

  return (
    <>
      {selectedShape.configurables.map((c) => (
        <CustomProperty
          key={c.name}
          selectedColorTab={selectedColorTab}
          configurable={c}
          onChange={doChange}
          onColorTabChange={doSelectColorTab}
          recentColors={recentColors}
          value={selectedShape.appearance.get(c.name)}
        />
      ))}
    </>
  )
}

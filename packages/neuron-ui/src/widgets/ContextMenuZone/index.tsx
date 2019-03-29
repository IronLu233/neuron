import React, { useCallback, useRef, useState } from 'react'
import { Overlay, ListGroup } from 'react-bootstrap'
import styled from 'styled-components'

const MenuContainer = styled.div<{ x: number; y: number }>`
  position: absolute;
  top: ${props => `${props.y}px`};
  left: ${props => `${props.x}px`};
`

interface MenuState {
  show: boolean
  x: number
  y: number
  params?: object
}

interface MenuItem {
  label: string
  click?: Function
}

const initState: MenuState = {
  show: false,
  x: 0,
  y: 0,
  params: undefined,
}

const Menu = ({ items, params }: { items: MenuItem[]; params?: object }) => (
  <ListGroup>
    {items.map(({ label, click }) => (
      <ListGroup.Item action key={label} onClick={click && click(params)}>
        {label}
      </ListGroup.Item>
    ))}
  </ListGroup>
)

const ContextMenuZone = ({
  children,
  menuItems,
}: React.PropsWithoutRef<{ children: React.ReactChild | React.ReactChild[]; menuItems: MenuItem[] }>) => {
  const [state, setState] = useState(initState)

  const onContextMenu = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const { target } = e.nativeEvent
    let params = (target as any).getAttribute('data-menuitem')
    if (params) {
      try {
        params = JSON.parse(params)
      } catch (err) {
        console.error('Invalid data-menuitem')
      }
    }
    setState({ show: true, x: e.nativeEvent.pageX, y: e.nativeEvent.pageY, params })
  }, [])

  const onHide = useCallback(() => {
    setState((current: MenuState) => ({ ...current, show: false }))
  }, [])

  const attachRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div onContextMenu={onContextMenu} ref={attachRef}>
        {children}
      </div>
      {attachRef.current ? (
        <Overlay target={attachRef.current} show={state.show} rootClose onHide={onHide}>
          {() => (
            <MenuContainer x={state.x} y={state.y}>
              <Menu items={menuItems} params={state.params} />
            </MenuContainer>
          )}
        </Overlay>
      ) : null}
    </>
  )
}

ContextMenuZone.displayName = 'ContextMenuZone'

export default ContextMenuZone

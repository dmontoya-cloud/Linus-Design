import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DeviceFrame } from './DeviceFrame'

describe('DeviceFrame', () => {
  it('labels the iPhone 17 simulator with its real viewport dimensions', () => {
    render(
      <DeviceFrame device="iphone17">
        <div>content</div>
      </DeviceFrame>,
    )
    expect(screen.getByText(/iPhone 17 simulator/)).toHaveTextContent('402×874')
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('labels the Galaxy S26 Ultra simulator with its real viewport dimensions', () => {
    render(
      <DeviceFrame device="galaxyS26Ultra">
        <div>content</div>
      </DeviceFrame>,
    )
    expect(screen.getByText(/Galaxy S26 Ultra simulator/)).toHaveTextContent('412×891')
  })

  it('renders the bezel as decorative (aria-hidden notch)', () => {
    const { container } = render(
      <DeviceFrame device="iphone17">
        <div>content</div>
      </DeviceFrame>,
    )
    const notch = container.querySelector('[aria-hidden="true"]')
    expect(notch).not.toBeNull()
  })
})

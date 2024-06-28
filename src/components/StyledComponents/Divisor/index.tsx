import styled from 'styled-components'

const Divisor = styled.div<{ $thickness?: string; $width?: string }>`
  width: 100%;
  position: relative;
  &::after {
    content: '';
    width: ${props => props.$width ?? '90%'};
    height: ${props => props.$thickness ?? '1px'};
    background-color: #ccc;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
`

export default Divisor

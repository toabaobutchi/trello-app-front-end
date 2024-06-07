import styled from 'styled-components'

const Flex = styled.div<{
  $alignItem?: string
  $justifyContent?: string
  $flexWrap?: string
  $flexDirection?: string
  $gap?: string
}>`
  display: flex;
  align-items: ${props => props.$alignItem || 'start'};
  justify-content: ${props => props.$justifyContent || 'flex-start'};
  flex-wrap: ${props => props.$flexWrap || 'no-wrap'};
  flex-direction: ${props => props.$flexDirection || 'row'};
  gap: ${props => props.$gap || 'auto'};
`

export default Flex

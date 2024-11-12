import ImagesStack from '@comps/ImagesStack'
import { useProjectSelector } from '@hooks/useProjectSelector'
import useSlice from '@hooks/useSlice'

function ProjectMembers() {
  const members = useProjectSelector().members
  const imageSources = members.map(member => member.avatar || '')
  const sliceResult = useSlice(imageSources, 0, 5)
  return (
    <ImagesStack className='cpointer'>
      {sliceResult.data.map(src => (
        <img key={src} src={src} alt='avatar' />
      ))}
      {sliceResult.hasMore && <div className='more-avatars'>+{sliceResult.rest.length}</div>}
    </ImagesStack>
  )
}

export default ProjectMembers

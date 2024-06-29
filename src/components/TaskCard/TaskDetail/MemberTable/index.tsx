import Button from '@comps/Button'
import './MemberTable.scss'
import Flex from '@comps/StyledComponents/Flex'
const taskAssignments = [
  {
    displayName: 'John',
    id: 'abc',
    email: 'john@example.com',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJIwASCJpICHRbFDOQXQ2S-pmikc8vs6K2GA&s'
  },
  {
    displayName: 'Hena',
    id: 'xyz',
    email: 'hena@example.com',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYyKp-_bgWk7d5uBGUfl2Nxnm8FfmUXGcoHyKoRvfbj14dugmQw82HXTG_RLe1U4KWx0s&usqp=CAU'
  },
  {
    displayName: 'Cam',
    id: 'def',
    email: 'cam@example.com',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8zx3vcYiH2J0MUFlZ1EcORxwgserN_RmQnw&s'
  },
  {
    displayName: 'Mary',
    id: 'ghj',
    email: 'mary@example.com',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCYnLAL0b-nqnyHK2mxqGCDZo8PVH1SANOsg&s'
  }
]
function MemberTable() {
  return (
    <>
      <p className='mb-1 text-primary'>Task member</p>
      <Flex $alignItem='center' $flexDirection='column' $gap='0.5rem' style={{ marginTop: '0.5rem', padding: "0 0.25rem" }}>
        <div className='member-info'>
          <Flex $alignItem='center' $gap='1rem'>
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCYnLAL0b-nqnyHK2mxqGCDZo8PVH1SANOsg&s' alt='avatar' />
            <div>
              <p className='member-info-title'>mary@example.com (Mary)</p>
              <p className='member-info-role'>Admin</p>
            </div>
          </Flex>
          <Button theme='danger'>
            <i className='fa-regular fa-trash-can'></i>
          </Button>
        </div>
        <div className='member-info'>
          <Flex $alignItem='center' $gap='1rem'>
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCYnLAL0b-nqnyHK2mxqGCDZo8PVH1SANOsg&s' alt='avatar' />
            <div>
              <p className='member-info-title'>mary@example.com (Mary)</p>
              <p className='member-info-role'>Admin</p>
            </div>
          </Flex>
          <Button theme='danger'>
            <i className='fa-regular fa-trash-can'></i>
          </Button>
        </div>
        <div className='member-info'>
          <Flex $alignItem='center' $gap='1rem'>
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCYnLAL0b-nqnyHK2mxqGCDZo8PVH1SANOsg&s' alt='avatar' />
            <div>
              <p className='member-info-title'>mary@example.com (Mary)</p>
              <p className='member-info-role'>Admin</p>
            </div>
          </Flex>
          <Button theme='danger'>
            <i className='fa-regular fa-trash-can'></i>
          </Button>
        </div>
      </Flex>
    </>
  )
}

export default MemberTable

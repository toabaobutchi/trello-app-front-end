import Flex from '@comps/StyledComponents/Flex'
import PriorityTag from './PriorityTag'
import './TaskCard.scss'
import Button from '@comps/Button'
import DropdownMenu from '@comps/DropdownMenu'
import MenuItem from '@comps/MenuItem'

function TaskCard({ priority }: { priority?: string | null }) {
  return (
    <>
      <div className='task-card'>
        <Flex $alignItem='center' $justifyContent='space-between' className='task-card-header'>
          <PriorityTag priority={priority} />
          {/* <Button variant='text' theme='default'>
            <i className='fa-solid fa-ellipsis-vertical'></i>
          </Button> */}
          <DropdownMenu
            useArrow={false}
            dir='rtl'
            showOn='click'
            title={{
              content: (
                <Button variant='text' theme='default'>
                  <i className='fa-solid fa-ellipsis-vertical'></i>
                </Button>
              ),
              style: {
                padding: 0,
                borderRadius: 0
              }
            }}
          >
            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 1</MenuItem>
          </DropdownMenu>
        </Flex>
        <div className='task-card-body'>
          <div className='task-card-body-name'>Task 1</div>
          <div className='task-card-body-description'>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Delectus, impedit fugiat? Cumque eos nihil
            dignissimos, ad nesciunt in?
          </div>
        </div>
        <Flex $alignItem='center' $justifyContent='space-between' className='task-card-footer'>
          <Flex $alignItem='center' className='task-card-footer-members'>
            <div className='task-card-footer-members-image-container'>
              <img
                src='https://ph-files.imgix.net/bdc4efe6-c303-41c2-9228-7228415b5509.png?auto=format&fit=crop'
                alt='avatar image'
              />
            </div>
            <div className='task-card-footer-members-image-container'>
              <img
                src='https://imgv3.fotor.com/images/gallery/american-anime-stule-naked-man-avatar.jpg'
                alt='avatar image'
              />
            </div>
            <div className='task-card-footer-members-image-container'>
              <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgfqMa1RwbmuH-3DDNzUidYKt1pNPu8VeE4ZNYxPg97rQ84lGAwOppT-riYVoEGCTeC5k&usqp=CAU'
                alt='avatar image'
              />
            </div>
            + 4 more
          </Flex>
          <div className='task-card-footer-due-date'>16/07</div>
        </Flex>
      </div>
    </>
  )
}

export default TaskCard

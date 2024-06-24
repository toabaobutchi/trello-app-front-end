import { ProjectResponseForBoard } from '@utils/types'

const boardData: ProjectResponseForBoard = {
  id: '1',
  name: 'Project',
  color: '#000000',
  createdAt: 123456789,
  dueDate: 123456789,
  context: 'test',
  workspaceId: '1',
  lists: [
    {
      id: 1,
      name: 'Todo',
      index: 1,
      updatedAt: 123456789,
      projectId: '1',
      tasks: [
        {
          id: '1',
          name: 'Test 1',
          description: 'Test 1 description',
          dueDate: 123456789,
          priority: 'Low',
          listId: 1,
          assigneeCount: 5,
          
        },
        {
          id: '2',
          name: 'Test 2',
          description: '',
          dueDate: 123456789,
          priority: 'High',
          listId: 1,
          assigneeCount: 4,
        },
        {
          id: '3',
          name: 'test 3',
          description: 'test 3 description',
          dueDate: 123456789,
          priority: undefined,
          listId: 1,
          assigneeCount: 7,
        }
      ]
    },
    {
      id: 2,
      name: 'Doing',
      index: 2,
      updatedAt: 123456789,
      projectId: '1',
      tasks: [
        {
          id: '4',
          name: 'Test 4',
          description: 'Test 4 description',
          dueDate: 123456789,
          priority: 'Medium',
          listId: 2,
          assigneeCount: 5,
          
        },
        {
          id: '5',
          name: 'Test 5',
          description: 'Test 5 description',
          dueDate: 123456789,
          priority: 'Low',
          listId: 2,
          assigneeCount: 5,
          
        },
        {
          id: '6',
          name: 'Test 6',
          description: 'Test 6 description',
          dueDate: 123456789,
          priority: 'High',
          listId: 2,
          assigneeCount: 5,
          
        },
        {
          id: '7',
          name: 'Test 7',
          description: '',
          dueDate: 123456789,
          listId: 2,
          priority: 'Normal',
          assigneeCount: 4,
        
        },
        {
          id: '8',
          name: 'Test 8',
          description: 'Test 8 description',
          dueDate: 123456789,
          listId: 2,
          priority: undefined,
          assigneeCount: 7,
        }
      ]
    },
    {
      id: 3,
      name: 'Done',
      index: 3,
      updatedAt: 123456789,
      projectId: '1',
      tasks: [
        {
          id: '9',
          name: 'Test 9',
          description: 'Test 9 description',
          dueDate: 123456789,
          listId: 3,
          priority: 'Low',
          assigneeCount: 5,
          
        },
        {
          id: '10',
          name: 'Test 10',
          description: '',
          dueDate: 123456789,
          listId: 3,
          priority: 'High',
          assigneeCount: 4,
        
        }
      ]
    }
  ]
}

export default Promise.resolve(boardData)

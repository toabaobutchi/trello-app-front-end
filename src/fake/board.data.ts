import { ProjectForBoard } from "@utils/types"


const boardData: ProjectForBoard = {
  id: '1',
  name: 'Project',
  color: '#000000',
  createdAt: 123456789,
  dueDate: 123456789,
  context: 'test',
  lists: [
    {
      id: 1,
      name: 'Todo',
      index: 1,
      updatedAt: 123456789,
      tasks: [
        {
          id: 1,
          name: 'Test 1',
          description: 'Test 1 description',
          dueDate: 123456789,
          priority: 'Low',
          assigneeCount: 5,
          subTaskStatus: {
            finished: 1,
            unfinished: 2
          }
        },
        {
          id: 2,
          name: 'Test 2',
          description: '',
          dueDate: 123456789,
          priority: 'High',
          assigneeCount: 4,
          subTaskStatus: {
            finished: 5,
            unfinished: 0
          }
        },
        {
          id: 3,
          name: 'test 3',
          description: 'test 3 description',
          dueDate: 123456789,
          priority: undefined,
          assigneeCount: 7,
          subTaskStatus: {
            finished: 1,
            unfinished: 1
          }
        }
      ]
    },
    {
      id: 2,
      name: 'Doing',
      index: 2,
      updatedAt: 123456789,
      tasks: [
        {
          id: 4,
          name: 'Test 1',
          description: 'Test 1 description',
          dueDate: 123456789,
          priority: 'Medium',
          assigneeCount: 5,
          subTaskStatus: {
            finished: 1,
            unfinished: 2
          }
        },
        {
          id: 5,
          name: 'Test 2',
          description: 'Test 2 description',
          dueDate: 123456789,
          priority: 'Low',
          assigneeCount: 5,
          subTaskStatus: {
            finished: 1,
            unfinished: 2
          }
        },
        {
          id: 6,
          name: 'Test 3',
          description: 'Test 3 description',
          dueDate: 123456789,
          priority: 'High',
          assigneeCount: 5,
          subTaskStatus: {
            finished: 1,
            unfinished: 2
          }
        },
        {
          id: 7,
          name: 'Test 4',
          description: '',
          dueDate: 123456789,
          priority: 'Normal',
          assigneeCount: 4,
          subTaskStatus: {
            finished: 5,
            unfinished: 0
          }
        },
        {
          id: 8,
          name: 'test 5',
          description: 'test 5 description',
          dueDate: 123456789,
          priority: undefined,
          assigneeCount: 7,
          subTaskStatus: {
            finished: 1,
            unfinished: 1
          }
        }
      ]
    },
    {
      id: 3,
      name: 'Done',
      index: 3,
      updatedAt: 123456789,
      tasks: [
        {
          id: 9,
          name: 'Test 1',
          description: 'Test 1 description',
          dueDate: 123456789,
          priority: 'Low',
          assigneeCount: 5,
          subTaskStatus: {
            finished: 1,
            unfinished: 2
          }
        },
        {
          id: 10,
          name: 'Test 2',
          description: '',
          dueDate: 123456789,
          priority: 'High',
          assigneeCount: 4,
          subTaskStatus: {
            finished: 5,
            unfinished: 0
          }
        }
      ]
    }
  ]
}

export default Promise.resolve(boardData)

/* eslint-disable react-hooks/exhaustive-deps */
import Flex from '@comps/StyledComponents/Flex'
import './Project.scss'
import ProjectHeader from './partials/ProjectHeader'
import BoardContent from './partials/BoardContent'
import { ProjectResponseForBoard } from '@utils/types'
import { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { projectSlice } from '@redux/ProjectSlice'
import { AxiosResponse, HttpStatusCode } from 'axios'
import { RootState } from '@redux/store'
import HttpClient from '@utils/HttpClient'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import config from '@confs/app.config'

const http = new HttpClient()

function Project() {
  const loader = useLoaderData() as AxiosResponse
  const project = useSelector((state: RootState) => state.project.activeProject.board)
  const account = useSelector((state: RootState) => state.login.accountInfo)
  const boardData = loader?.data as ProjectResponseForBoard
  const dispatch = useDispatch()

  const [projectConnection, setProjectConnection] = useState<HubConnection>()

  useEffect(() => {
    dispatch(projectSlice.actions.setActiveProjectBoard(boardData))
  }, [boardData])

  useEffect(() => {
    if (boardData) {
      const connection = new HubConnectionBuilder().withUrl(`${config.baseUrl}/projectHub`).build()
      connection
        .start()
        .then(() => {
          setProjectConnection(connection)
          // dispatch(hubConnectionSlice.actions.setHubConnection(connection))
          connection.invoke('SubscribeProject', boardData.id, account.id)
        })
        .catch(err => console.log(err))
    }
  }, [])

  useEffect(() => {
    if (projectConnection) {
      projectConnection.on('ReceiveSubscriber', (assignmentIds: string[]) => {
        dispatch(projectSlice.actions.setOnlineMembers(assignmentIds))
      })
    }
  }, [projectConnection])

  useEffect(() => {
    // tải thành viên của project
    http.getAuth(`/assignments/in-project/${boardData.id}`).then(res => {
      if (res?.status === HttpStatusCode.Ok) {
        dispatch(projectSlice.actions.setProjectMembers(res.data))
      } else {
        console.log('Can not get project members', res?.data)
      }
    })
  }, [])

  return (
    <>
      {boardData && (
        <Flex $flexDirection='column' style={{ width: '100%', height: '100%' }}>
          <ProjectHeader />
          {project && <BoardContent />}
        </Flex>
      )}
    </>
  )
}

export default Project

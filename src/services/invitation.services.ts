import { http } from '@utils/Axios/HttpClientAuth'
import { AcceptInvitationResult, InvitedProjectResponse, RejectInvitationResult } from '@utils/types'

const handleInvitation = async (invitationId: string, action: 'accept' | 'reject') => {
  const res = await http.postWithoutData<AcceptInvitationResult | RejectInvitationResult>(
    `/invitations/${invitationId}/${action}`
  )
  return res
}

const getInvitedProjects = async () => {
  const res = await http.get<InvitedProjectResponse[]>(`/invited-projects`)
  return res
}

export { handleInvitation, getInvitedProjects }

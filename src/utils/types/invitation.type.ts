export type InvitationResult = {
  projectId: string
  invitationId: string
}

export type AcceptInvitationResult = {
  isAccepted: true
  assignmentId: string
  projectName: string
  projectSlug: string
  context: string
} & InvitationResult

export type RejectInvitationResult = InvitationResult & { isAccepted: false }
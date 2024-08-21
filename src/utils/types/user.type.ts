// lưu thông tin của người dùng khi đăng nhập
export type AccountType = {
  id: string
  displayName: string
  avatar?: string
  email: string
}

export type LoginInfo = {
  accessToken: string
  accountInfo: AccountType
}

export type AuthResponse = LoginInfo

export type OwnerInfo = AccountType

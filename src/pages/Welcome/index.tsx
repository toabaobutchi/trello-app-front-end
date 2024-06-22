import styled from 'styled-components'
import logo from '@assets/trello_pic.png'
import rightSideImage from '@assets/img_welcome.webp'
import config from '@confs/app.config'
import { GoogleLogin, useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google'
import { JwtPayload, jwtDecode } from 'jwt-decode'
import HttpClient from '@utils/HttpClient'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSlice } from './LoginSlice'

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`

const Wrapper = styled.div`
  width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
`

const WelcomePageHeader = styled.div`
  width: 100%;
  background-color: #fff;
  font-size: 1.2rem;
  color: var(--text-primary-color);
  font-weight: 600;
`

const Logo = styled.img`
  width: 30px;
  height: auto;
  object-fit: cover;
`

const WelcomePageBody = styled.div`
  background-color: var(--primary-color);
  color: #fff;
  width: 100%;
  flex: 1;
  height: 100%;
`

const CenterVertical = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  width: 100%;
`

const Title = styled.div`
  font-size: 3.5rem;
`

const SubTitle = styled.div`
  font-size: 1.5rem;
  font-style: italic;
  margin-bottom: 2rem;
`

const IntroContent = styled.div`
  font-size: 1.2rem;
`

const RightSideImage = styled.img`
  width: 600px;
  height: auto;
`

// const LoginButton = styled.button`
//   border: none;
//   background-color: #fff;
//   color: var(--text-primary-color);
//   font-size: 1.2rem;
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   padding: 0.5rem 1rem;
//   margin-top: 2rem;
//   border-radius: var(--primary-radius);
//   cursor: pointer;
//   font-weight: 500;
//   width: max-content;
//   text-decoration: none;
// `

const httpClient = new HttpClient()
interface GoogleDataType extends JwtPayload {
  email: string
  name: string
  picture: string
}
function Welcome() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogin = async (token?: string) => {
    const googleData = jwtDecode(token as string) as GoogleDataType
    const data = {
      email: googleData.email,
      name: googleData.name,
      avatar: googleData.picture,
      id: googleData.sub
    }
    const response = await httpClient.post('/account/signin', data, { withCredentials: true })
    if (response?.status === 200) {
      // thành công
      dispatch(loginSlice.actions.setAccessToken(response?.data))
      navigate('home')
    } else {
      console.log('Login Failed')
    }
  }
  useGoogleOneTapLogin({
    onSuccess: credentialResponse => handleLogin(credentialResponse.credential)
  })
  return (
    <>
      <Container>
        <WelcomePageHeader>
          <Wrapper>
            <Logo src={logo} alt='trello_logo' />
            <p>{config.appName}</p>
          </Wrapper>
        </WelcomePageHeader>
        <WelcomePageBody>
          <Wrapper>
            <CenterVertical>
              <div>
                <Title>{config.appName}</Title>
                <SubTitle>Powerful tool to manage your projects</SubTitle>
                <IntroContent>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit obcaecati nostrum minima quasi. Eos,
                  recusandae! Sequi ratione inventore ab maxime adipisci dolorem reprehenderit iusto ut, temporibus
                  nulla vel sunt minima!
                </IntroContent>
                <div style={{ marginTop: '1rem' }}>
                  <GoogleLogin
                    onSuccess={credentialResponse => {
                      handleLogin(credentialResponse.credential)
                    }}
                    onError={() => {
                      console.log('Login Failed')
                    }}
                    text='signup_with'
                  />
                </div>
              </div>
              <div>
                <RightSideImage src={rightSideImage} alt='right side image' />
              </div>
            </CenterVertical>
          </Wrapper>
        </WelcomePageBody>
      </Container>
    </>
  )
}

export default Welcome

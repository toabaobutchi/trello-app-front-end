import styled from 'styled-components'
import logo from '@assets/trello_pic.png'
import googleImage from '@assets/gg_icon.png'
import rightSideImage from '@assets/img_welcome.webp'
import config from '@confs/app.config'

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

const LoginButton = styled.button`
  border: none;
  background-color: #fff;
  color: var(--text-primary-color);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  margin-top: 2rem;
  border-radius: var(--primary-radius);
  cursor: pointer;
  font-weight: 500;

  &:hover {
    font-weight: 600;
  }
`

function Welcome() {
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
                <LoginButton>
                  <img src={googleImage} alt='google image' width='20px' />
                  <p>Quick start only with Google</p>
                </LoginButton>
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

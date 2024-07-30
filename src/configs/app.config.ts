const config = {
  env: 'Development',
  header: {
    height: '3.43rem'
  },
  sideBar: {
    expand: true,
    maxWidth: '300px',
    startMobileMode: {
      width: 768
    }
  },
  mainMenu: {
    width: '300px'
  },
  appName: 'Prosync',
  googleClientId: '642590641125-36p2odk1qkskt97ge5jii76ukgb8gtbn.apps.googleusercontent.com',
  baseUrl: 'https://localhost:7207',
  priorities: ['High', 'Medium', 'Normal', 'Low'],
  apiTimeout: 30 * 1000,
  timeOut: {
    drag: 60 * 1000,
    delayAfterEndDrag: 1 * 1000,
    dragBlock: 60 * 1000
  }
}
export default config

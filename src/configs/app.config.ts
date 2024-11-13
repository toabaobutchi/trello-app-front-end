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
    drag: 5 * 1000,
    delayAfterEndDrag: 1 * 1000,
    dragBlock: 5 * 1000
  },
  texts: {
    dateNotSet: '[Not set]'
  },
  // qs: query string
  qs: {
    boardMode: 'boardMode'
  }
}
export default config

const version = '20200920'

const ruleForm =
  process.env.NODE_ENV === 'production'
    ? {
        name: '',
        pass: '',
      }
    : {
        // name: '18012333330',
        // pass: '123456',
        name: '18012148888',
        pass: '234567',
        // name: '13338149978',
        // pass: '123456',
        // name: '13338149978',
        // pass: '123456',
        // name: '18061166850',
        // pass: '123456',
      }

export { version, ruleForm }

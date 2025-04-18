/* eslint-disable import/no-anonymous-default-export */
export default {
    control: {
      backgroundColor: '#fff',
      fontSize: 16,
      // fontWeight: 'normal',
    },
  
    '&singleLine': {
      display: 'inline-block',
  
      highlighter: {
        padding: 1,
        border: 'none',
      },
      input: {
        padding: 1,
        border: 'none',
      },
    },
  
    suggestions: {
      list: {
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.15)',
        borderRadius: 6,
        overflow: 'auto',
        fontSize: 14,
      },
      item: {
        padding: '5px 5px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        '&focused': {
          backgroundColor: '#f0f0f0',
        },
      },
    },
  }
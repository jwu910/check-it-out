export const actionType = {
  ADD_REF: 'ADD_REF',
  CHECK_LOG: 'CHECK_LOG',
  CHECKOUT_REF: 'CHECKOUT_REF',
  CLEAR_REFS: 'CLEAR_REFS',
  GET_CURRENT_BRANCH: 'GET_CURRENT_BRANCH',
  GET_REFS: 'GET_REFS',
  NEXT_REMOTE: 'NEXT_REMOTE',
  PREVIOUS_REMOTE: 'PREVIOUS_REMOTE',
}

export const addRef = (payload) => ({ payload, type: actionType.ADD_REF });

export const checkLog = (payload) => ({ payload, type: actionType.CHECK_LOG });

export const checkoutRef = (payload) => ({ payload, type: actionType.CHECKOUT_REF});

export const getCurrentBranch = (payload) => ({ payload, type: actionType.GET_CURRENT_BRANCH })

export const getRefs = (payload) => ({ payload, type: actionType.GET_REFS});

export const nextRemote = (payload) => ({ payload, type: actionType.NEXT_REMOTE});

export const previousRemote = (payload) => ({ payload, type: actionType.PREVIOUS_REMOTE});

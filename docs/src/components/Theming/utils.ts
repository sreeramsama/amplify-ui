import { isDesignToken } from '@aws-amplify/ui';

export function createTokenList(tokens) {
  const tokenList = [];
  function iterateGroup(group) {
    Object.values(group).forEach((value) => {
      if (isDesignToken(value)) {
        tokenList.push({
          ...value,
        });
      } else {
        iterateGroup(value);
      }
    });
  }
  if (isDesignToken(tokens)) {
    tokenList.push(tokens);
  } else {
    iterateGroup(tokens);
  }
  return tokenList;
}

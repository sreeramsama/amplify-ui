import classNames from 'classnames';

import { ComponentClassNames } from '../../shared';
import { View } from '../../View';
import { useDeprecationWarning } from '../../../hooks/useDeprecationWarning';

/**
 * @deprecated These icons are being removed in the next major release. You can use the [react-icons](https://react-icons.github.io/react-icons) package or other React icon libraries in its place. `import { IconDeveloperMode } from '@aws-amplify/ui-react';` → `import { MdDeveloperMode } from 'react-icons/md';`
 */
export const IconDeveloperMode = (props) => {
  const { className, ...rest } = props;
  useDeprecationWarning({
    shouldWarn: true,
    message: `Built-in icons are being deprecated in the next major release. You can use the react-icons (https://react-icons.github.io/react-icons) package with the Material Icon set in place of these icons or any other React Icon library.
import { IconDeveloperMode } from '@aws-amplify/ui-react'; → import { MdDeveloperMode } from 'react-icons/md';`,
  });
  return (
    <View
      as="span"
      width="1em"
      height="1em"
      className={classNames(ComponentClassNames.Icon, className)}
      {...rest}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 5H17V7H19V3C19 1.9 18.1 1.01 17 1.01L7 1C5.9 1 5 1.9 5 3V7H7V5ZM15.41 16.59L20 12L15.41 7.41L14 8.83L17.17 12L14 15.17L15.41 16.59ZM10 15.17L6.83 12L10 8.83L8.59 7.41L4 12L8.59 16.59L10 15.17ZM17 19H7V17H5V21C5 22.1 5.9 23 7 23H17C18.1 23 19 22.1 19 21V17H17V19Z"
          fill="currentColor"
        />
      </svg>
    </View>
  );
};

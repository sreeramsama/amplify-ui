import { Grid, Link, Heading } from '@aws-amplify/ui-react';

interface LinkableHeaderProps {
  id?: string;
  children: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variation?: 'border' | 'plain';
}

export const LinkableHeader = ({
  id,
  children,
  level = 2,
  variation = 'plain',
}: LinkableHeaderProps) => {
  return (
    <Heading
      id={id}
      className={`docs-linkableHeader--${variation}`}
      level={level}
    >
      {
        /* Assuming you added an id for this to show in the ToC,
         * we'll add the utility hover anchor link here */
        id ? (
          <a aria-hidden="true" tabIndex={-1} href={`#${id}`}>
            <span className="icon icon-link"></span>
          </a>
        ) : null
      }
      {children}
    </Heading>
  );
};

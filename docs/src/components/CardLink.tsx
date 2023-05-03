import classNames from 'classnames';
import { Grid, Link, Heading } from '@aws-amplify/ui-react';
import { LinkableHeader } from './LinkableHeader';

interface CardLinkProps {
  href: string;
  title: string;
  desc: string;
  icon?: React.ReactNode;
  className?: string;
  variation?: 'plain' | 'branded' | 'home';
}

export function CardLink({
  href,
  title,
  desc,
  icon,
  variation = 'plain',
  className,
}: CardLinkProps) {
  const classes = classNames(
    `docs-cardLink`,
    `docs-cardLink--${variation}`,
    className
  );

  return (
    <Link href={href} className={classes}>
      {icon && <div className="docs-cardLink-icon">{icon}</div>}
      <div className="docs-cardLink-details">
        <div className="docs-cardLink-title">{title}</div>
        <div className="docs-cardLink-desc">{desc}</div>
      </div>
    </Link>
  );
}

interface CardLinkGroupProps {
  title?: string;
  // Passing an id to the group attaches it to the title, which
  // will allow it to show in the ToC
  id?: string;
  children: React.ReactNode;
  templateColumns?: string | object;
  gap?: string;
}

export function CardLinkGroup({
  title,
  children,
  templateColumns = { base: '1fr', large: '1fr 1fr' },
  id,
  gap = 'large',
}: CardLinkGroupProps) {
  return (
    <>
      {title ? (
        <LinkableHeader variation="border" id={id}>
          {title}
        </LinkableHeader>
      ) : null}
      <Grid
        className="docs-cardLinkGroup"
        gap={gap}
        templateColumns={templateColumns}
      >
        {children}
      </Grid>
    </>
  );
}

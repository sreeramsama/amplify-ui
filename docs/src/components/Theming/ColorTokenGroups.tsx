import * as React from 'react';
import { ContrastControls } from './ContrastControls';
import { TokenList } from './TokenList';
import { LinkableHeader } from '@/components/LinkableHeader';
import { ContrastType } from './types';

export const ColorTokenGroups = ({}) => {
  const [contrastType, setContrastType] =
    React.useState<ContrastType>('textContrast');
  const [contrastBgColor, setContrastBgColor] = React.useState('white');

  return (
    <>
      <ContrastControls
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        handleBgColorChange={(value: string) => setContrastBgColor(value)}
        handleContrastTypeChange={(e) =>
          setContrastType(e.target.value as ContrastType)
        }
      />
      <LinkableHeader level={3} id="color-font">
        Font
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['font']}
      />
      <LinkableHeader level={3} id="color-background">
        Background
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['background']}
      />
      <LinkableHeader level={3} id="color-border">
        Border
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['border']}
      />
      <LinkableHeader level={3} id="color-shadow">
        Shadow
      </LinkableHeader>
      <TokenList namespace="colors" childNamespace={['shadow']} />
      <LinkableHeader level={3} id="color-overlay">
        Overlay
      </LinkableHeader>
      <TokenList namespace="colors" childNamespace={['overlay']} />
      <LinkableHeader level={2} id="color-brand">
        Brand
      </LinkableHeader>
      <LinkableHeader level={3} id="color-brand-primary">
        Primary
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['brand', 'primary']}
      />
      <LinkableHeader level={3} id="color-brand-secondary">
        Secondary
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['brand', 'secondary']}
      />
      <LinkableHeader level={2} id="color-palette">
        Palette
      </LinkableHeader>
      <LinkableHeader level={3} id="color-neutral">
        Neutral
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['neutral']}
      />
      <LinkableHeader level={3} id="color-red">
        Red
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['red']}
      />
      <LinkableHeader level={3} id="color-orange">
        Orange
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['orange']}
      />
      <LinkableHeader level={3} id="color-yellow">
        Yellow
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['yellow']}
      />
      <LinkableHeader level={3} id="color-green">
        Green
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['green']}
      />
      <LinkableHeader level={3} id="color-teal">
        Teal
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['teal']}
      />
      <LinkableHeader level={3} id="color-blue">
        Blue
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['blue']}
      />
      <LinkableHeader level={3} id="color-purple">
        Purple
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['purple']}
      />
      <LinkableHeader level={3} id="color-pink">
        Pink
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['pink']}
      />
      <LinkableHeader level={3} id="color-black">
        Black
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['black']}
      />
      <LinkableHeader level={3} id="color-white">
        White
      </LinkableHeader>
      <TokenList
        namespace="colors"
        showContrast
        contrastType={contrastType}
        contrastBgColor={contrastBgColor}
        childNamespace={['white']}
      />
      <LinkableHeader level={3} id="color-transparent">
        Transparent
      </LinkableHeader>
      <TokenList namespace="colors" childNamespace={['transparent']} />
    </>
  );
};

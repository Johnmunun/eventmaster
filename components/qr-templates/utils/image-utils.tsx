import { GlobalConfig } from "@/lib/stores/qr-template-store"

export function getImageBorderStyle(globalConfig: GlobalConfig) {
  const { imageBorderStyle, imageBorderWidth, imageBorderColor, imageBorderRadius } = globalConfig

  const borderRadiusMap = {
    none: 'rounded-none',
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
    full: 'rounded-full',
  }

  const borderRadius = borderRadiusMap[imageBorderRadius]

  if (imageBorderStyle === 'none') {
    return {
      className: borderRadius,
      style: {},
    }
  }

  if (imageBorderStyle === 'shadow') {
    return {
      className: `${borderRadius} shadow-lg`,
      style: {},
    }
  }

  if (imageBorderStyle === 'gradient') {
    return {
      className: borderRadius,
      style: {
        border: `${imageBorderWidth}px solid transparent`,
        backgroundImage: `linear-gradient(white, white), linear-gradient(135deg, ${globalConfig.primaryColor}, ${globalConfig.secondaryColor})`,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      },
    }
  }

  const borderStyleMap = {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    double: 'double',
  }

  return {
    className: borderRadius,
    style: {
      border: `${imageBorderWidth}px ${borderStyleMap[imageBorderStyle]} ${imageBorderColor}`,
    },
  }
}




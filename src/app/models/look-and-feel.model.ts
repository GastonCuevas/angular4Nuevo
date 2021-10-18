export class LookAndFeel {
  section: string;
  fontColor: string;
  fontFamily: string;
  backgroundColor: string;
  companyNumber?: number;
  code?: string;
  imagePath?: string;
  imageBase?: string;

  constructor(
    section: string,
    fontColor: string,
    fontFamily: string,
    backgroundColor: string,
    companyNumber?: number,
    code?: string,
    imagePath?: string,
    imageBase?: string
  ) {
    this.companyNumber = companyNumber
    this.code = code
    this.section = section
    this.fontColor = fontColor
    this.fontFamily = fontFamily
    this.backgroundColor = backgroundColor
    this.imagePath = imagePath
    this.imageBase = imageBase
  }
}

export class LookAndFeelConfig {
  imageLogo: string;
  fontFamilyMenu: string;
  fontColorMenu: string;
  fontFamilySubMenu: string;
  fontFamilyHeader: string;
  fontColorHeader: string;
  backgroundColorHeader: string;
  backgroundColorMenu: string;
  imageLogin: string;
  fontColorLogin: string;
  fontFamilyLogin: string;
  backgroundColorLogin: string;
  version: string;

  constructor(
    imageLogo: string,
    fontFamilyMenu: string,
    fontColorMenu: string,
    fontFamilySubMenu: string,
    fontFamilyHeader: string,
    fontColorHeader: string,
    backgroundColorHeader: string,
    backgroundColorMenu: string,
    imageLogin: string,
    fontColorLogin: string,
    fontFamilyLogin: string,
    backgroundColorLogin: string,
    version: string
  ) {
    this.imageLogo = imageLogo
    this.fontFamilyMenu = fontFamilyMenu
    this.fontColorMenu = fontColorMenu
    this.fontFamilySubMenu = fontFamilySubMenu
    this.fontFamilyHeader = fontFamilyHeader
    this.fontColorHeader = fontColorHeader
    this.backgroundColorHeader = backgroundColorHeader
    this.backgroundColorMenu = backgroundColorMenu
    this.imageLogin = imageLogin
    this.fontColorLogin = fontColorLogin
    this.fontFamilyLogin = fontFamilyLogin
    this.backgroundColorLogin = backgroundColorLogin
    this.version = version
  }
}

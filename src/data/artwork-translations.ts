import type {Artwork, Language as ContentLanguage} from './artworks';
import type {Language as InterfaceLanguage} from './i18n';

export type LocalizedArtwork = Omit<Artwork, 'medium' | 'description'> & {
  medium: string;
  description: string;
};

const contentLanguages: Record<InterfaceLanguage, ContentLanguage> = {
  pl: 'PL', en: 'EN', fr: 'FR',
};

/** Resolve unfinished translations without rendering objects or whitespace. */
export function localizeText(text: Partial<Record<ContentLanguage, string>>, language: InterfaceLanguage): string {
  const order: ContentLanguage[] = [contentLanguages[language], 'EN', 'PL', 'FR'];
  for (const key of order) {
    const value = text[key];
    if (value?.trim()) return value;
  }
  return '';
}

/** Catalogue content lives in artworks.ts; localization does not mutate it. */
export function localizeArtwork(artwork: Artwork, language: InterfaceLanguage): LocalizedArtwork {
  return {
    ...artwork,
    medium: localizeText(artwork.medium, language),
    description: localizeText(artwork.description, language),
  };
}

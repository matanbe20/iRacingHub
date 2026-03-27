import { getSeriesLogoUrl } from '../utils/helpers';
import type { Category } from '../types';

interface Props {
  category: Category;
  name: string;
  className?: string;
}

export default function SeriesLogo({ category, name, className }: Props) {
  const url = getSeriesLogoUrl(category, name);
  if (!url) return null;

  return (
    <img
      src={url}
      alt=""
      loading="lazy"
      decoding="async"
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
      className={className}
    />
  );
}

import Inline from '@/components/sections/Inline';

const WIDTH = { md: 'max-w-2xl', lg: 'max-w-3xl' };
const GAP = { sm: 'mb-10', md: 'mb-12', lg: 'mb-14' };

type Props = {
  eyebrow: string;
  title: string;
  intro?: string;
  width?: keyof typeof WIDTH;
  gap?: keyof typeof GAP;
  // `lead` is the larger intro used under the widest headers.
  introSize?: 'body' | 'lead';
};

/** Eyebrow, h2 and optional intro above a block's content. */
export default function SectionHeader({ eyebrow, title, intro, width = 'md', gap = 'lg', introSize = 'body' }: Props) {
  const introClass = introSize === 'lead'
    ? 'text-muted text-[18px] mt-6 max-w-2xl leading-relaxed'
    : `text-muted text-[17px] mt-5${width === 'lg' ? ' max-w-2xl' : ''}`;
  return (
    <div className={`${WIDTH[width]} ${GAP[gap]}`}>
      <span className="eyebrow mb-6"><Inline text={eyebrow} /></span>
      <h2 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.07] tracking-tight"><Inline text={title} /></h2>
      {intro && <p className={introClass}><Inline text={intro} /></p>}
    </div>
  );
}

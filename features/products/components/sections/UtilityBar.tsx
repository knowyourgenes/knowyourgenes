// Thin info bar rendered directly under the site header (per request).
// Woodsmoke background, centered helpline copy with the number emphasised.
export default function UtilityBar({ text, phone }: { text: string; phone: string }) {
  return (
    <div className="bg-wood px-4 py-[8px] text-center">
      <p className="text-[12.5px] leading-[1.5] text-linenw/90">
        {text}{' '}
        <a href={`tel:${phone.replace(/[^0-9]/g, '')}`} className="font-semibold underline underline-offset-2">
          {phone}
        </a>
      </p>
    </div>
  );
}

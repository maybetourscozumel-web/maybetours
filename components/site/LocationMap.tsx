export default function LocationMap({
  query,
  className,
}: {
  query: string;
  className?: string;
}) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  return (
    <iframe
      src={src}
      className={className}
      style={{ border: 0 }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Map showing the tour meeting point"
    />
  );
}

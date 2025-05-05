type HeadingType = {
  title: string;
  description: string;
  keywords: string;
};

export const Heading = ({ title, description, keywords }: HeadingType) => {
  return (
    <>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </>
  );
};

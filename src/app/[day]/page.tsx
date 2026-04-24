// import styles from './page.module.scss';

interface PageProps {
  params: Promise<{ day: string }>;
}

export default async function TrainingDayPage({ params }: PageProps) {
  const { day } = await params;

  return (
    <div className=''>
      <h1>{day}</h1>
    </div>
  );
}

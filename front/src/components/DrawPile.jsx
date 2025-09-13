import Card from './Card';

export default function DrawPile() {
  return (
    <div className="flex justify-center items-center">
      <div className="-mr-8 sm:-mr-6 md:-mr-5 lg:-mr-4">
        <Card hidden={false} />
      </div>
      <div className="-mr-8 sm:-mr-6 md:-mr-5 lg:-mr-4">
        <Card hidden={false} />
      </div>
      <div className="-mr-8 sm:-mr-6 md:-mr-5 lg:-mr-4">
        <Card hidden={false} />
      </div>
      <div className="-mr-8 sm:-mr-6 md:-mr-5 lg:-mr-4">
        <Card hidden={false} />
      </div>
      <div className="-mr-8 sm:-mr-6 md:-mr-5 lg:-mr-4">
        <Card hidden={false} />
      </div>
      <div>
        <Card hidden={false} />
      </div>
    </div>
  );
}

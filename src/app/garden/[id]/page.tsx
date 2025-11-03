import GardenDetail from "../../../widgets/GardenDetail";
interface GardenDetailProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: GardenDetailProps) => {
  const { id } = await params;
  return (
    <div>
      <GardenDetail id={id} />
    </div>
  );
};

export default page;

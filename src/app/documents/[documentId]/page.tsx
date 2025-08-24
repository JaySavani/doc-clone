import Editor from "./editor";

interface DocumentIdPageProps {
  params: Promise<{
    documentId: string;
  }>;
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = await params;
  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      <h1 className="text-2xl font-bold p-4">Document ID: {documentId}</h1>
      <Editor />
    </div>
  );
};

export default DocumentIdPage;

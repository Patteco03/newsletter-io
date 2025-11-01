export default function NotFound() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-muted-foreground mb-8">Desculpe a página que você está procurando não existe.</p>
        <a href="/" className="text-primary hover:underline">
          Voltar para a página inicial
        </a>
      </div>
    </div>
  );
}

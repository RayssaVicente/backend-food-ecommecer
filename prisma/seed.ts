import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  console.log("🧹 Limpando dados antigos...")
  await prisma.product.deleteMany()

  console.log("🌱 Inserindo novos produtos...")
  await prisma.product.createMany({
    data: [
      {
        category: "hamburgers",
        name: "Mega",
        description: "O artesanal tamanho família recheado com duas carnes suculentas, queijo e bacon.",
        price: 25.50,
        image: "/foods/burger.jpg"
      },
      {
        category: "hamburgers",
        name: "Extra Bacon",
        description: "Criado para os amantes de bacon, possui em todas as suas camadas bacon bem assado.",
        price: 23.50,
        image: "/foods/bastante-bacon.jpg"
      },
      {
        category: "hamburgers",
        name: "Tradicional",
        description: "O simples também é delicioso, principalmente se envolver nossa carne artesanal.",
        price: 12.00,
        image: "/foods/tradicional.webp"
      },
      {
        category: "hamburgers",
        name: "Big Carne",
        description: "Uma carne artesanal de primeira qualidade com 4cm de altura e uma salada completa.",
        price: 18.00,
        image: "/foods/gig-carne.jpg"
      },
      {
        category: "pizzas",
        name: "Calabresa",
        description: "Molho de tomate artesanal, mussarela e calabresa selecionada.",
        price: 45.00,
        image: "/foods/pizza-calabreza.jpg"
      },
      {
        category: "pizzas",
        name: "Portuguesa",
        description: "Pizza recheada com presunto, mussarela, ovo, cebola, ervilha e azeitona.",
        price: 28.50,
        image: "/foods/pizza-portuguesa.jpg"
      },
      {
        category: "pizzas",
        name: "Frango com Catupiry",
        description: "Pizza recheada com frango desfiado, catupiry e milho.",
        price: 24.00,
        image: "/foods/pizza-frango.jpg"
      },
      {
        category: "pizzas",
        name: "Mussarela",
        description: "Nossa famosa mussarela com molho de tomate artesanal e orégano.",
        price: 20.50,
        image: "/foods/pizza-mussarela.jpg"
      },
      {
        category: "pizzas",
        name: "Margerita",
        description: "Pizza recheada com manjericão, cebola, mussarela, orégano e azeitona.",
        price: 25.00,
        image: "/foods/margarita.jpg"
      },
      {
        category: "pizzas",
        name: "Brigadeiro com kitkat",
        description: "Pizza recheada com brigadeiro, chocolate e kitkat.",
        price: 26.00,
        image: "/foods/pizza-brigadeiro.jpg"
      },
      {
        category: "pizzas",
        name: "Banana Doce de Leite",
        description: "Pizza recheada com banana e doce de leite.",
        price: 24.00,
        image: "/foods/banana-doce-de-leite.jpg"
      },
      {
        category: "pizzas",
        name: "Brigadeiro com morango",
        description: "Pizza recheada com brigadeiro, morango e granulado.",
        price: 27.00,
        image: "/foods/chocolate-morango.jpg"
      },
      {
        category: "drinks",
        name: "Soda",
        description: "Refrigerante de soda com sabor cítrico.",
        price: 5.00,
        image: "/foods/soda.jpg"
      },
      {
        category: "drinks",
        name: "Coca-Cola",
        description: "Refrigerante clássico de coca-cola.",
        price: 5.50,
        image: "/foods/coca-colaa.jpg"
      },
      {
        category: "drinks",
        name: "Fanta",
        description: "Refrigerante de laranja com sabor natural.",
        price: 5.00,
        image: "/foods/fanta.jpg"
      },
      {
        category: "drinks",
        name: "Suco de Maracujá",
        description: "Suco de maracujá com sabor natural.",
        price: 5.00,
        image: "/foods/suco-maracuja.avif"
      },
      {
        category: "drinks",
        name: "Suco de Uva",
        description: "Suco de uva com sabor natural.",
        price: 5.50,
        image: "/foods/suco-uva.jpg"
      },
      {
        category: "drinks",
        name: "Suco de Laranja",
        description: "Suco de laranja com sabor natural.",
        price: 5.00,
        image: "/foods/suco-laranja.jpg"
      },
      {
        category: "sorvetes",
        name: "Picole",
        description: "Picole de morango com cobertura de chocolate.",
        price: 5.00,
        image: "/foods/picoles.jpg"
      },
      {
        category: "sorvetes",
        name: "Bolas Sorvetes",
        description: "Bolas de sorvete com cobertura de granulado.",
        price: 8.00,
        image: "/foods/bolas-sorvetes.jpg"
      },
      {
        category: "sorvetes",
        name: "Sorvete Casquinha",
        description: "Sorvete em casquinha com calda de chocolate.",
        price: 7.50,
        image: "/foods/sorvete-casquinha.jpg"
      },
      {
        category: "sorvetes",
        name: "Açaí",
        description: "Açaí com granola e banana.",
        price: 12.00,
        image: "/foods/acai.jpg"
      }
    ]
  })

  console.log("✅ Banco de dados populado com sucesso!")
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
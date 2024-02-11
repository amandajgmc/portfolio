export interface Project {
  id: number;
  title: string;
  category?: string;
  content: string;
  images: string[];
  mainImage?: string;
}
export const projects: Project[] = [
  {
    id: 1,
    title: 'CRM Pizzaria',
    category: 'Sites',
    content: 'Conteúdo conteúdo conteúdo',
    images: [
      'projects/pizzaria/Administrador-01.png',
      'projects/pizzaria/Administrador-02.png',
      'projects/pizzaria/Administrador-03.png',
      'projects/pizzaria/Administrador-04.png',
      'projects/pizzaria/Administrador-05.png',
      'projects/pizzaria/Administrador-06.png',
      'projects/pizzaria/Administrador-07.png',
      'projects/pizzaria/Administrador-08.png',
      'projects/pizzaria/Administrador-09.png',
      'projects/pizzaria/Administrador-10.png',
      'projects/pizzaria/Administrador-11.png',
      'projects/pizzaria/Administrador-12.png',
      'projects/pizzaria/Administrador-13.png',
      'projects/pizzaria/Administrador-14.png',
      'projects/pizzaria/Administrador-15.png',
    ],
  },
  {
    id: 2,
    title: 'AMP Vans',
    category: 'Social Media',
    content:
      'A AMP Vans é uma empresa de transporte especializada na locação de vans. Eles me procuraram para manter uma simetria visual das suas redes sociais, iniciando pelo instagram. Eles queriam que as peças transmitisse segurança, seriedade e modernidade e para isso, eu me utilizei do espaço negativo para explicitar a seriedade e modernidade da empresa, com traços retos e inclinados, elas trazem o movimento moderno para todo o contexto da imagem.',
    images: ['projects/amp/vans.png'],
  },
  {
    id: 3,
    title: 'Café com leite | Podcast',
    category: 'Social Media',
    content:
      'Café com leite é uma escola de música do litoral de São Paulo e estava querendo fazer uma reestruturação do seu instagram.  Voltado para o público infantil, eles queriam algo alegre e divertido, com toques de cartoon em alguns momentos.  Com isso em mente, o primeiro item a ser usado foi o contorno forte e preto, uma grande característica de desenho.  Faixas saindo do centro, desenhos, fundo quadriculado, tudo isso trouxe uma ar leve e divertido, infantil e animado.  O uso de uma fonte mais arredondada, que transmite mais proximidade, foi estratégia para essa identificação do público adulto que aquele ambiente está voltado ao público infantil.',
    images: ['projects/cafe/leite.jpg'],
  },
  {
    id: 4,
    title: 'Ecomercial',
    category: 'Identidade Visual',
    content:
      'A E-Comercial era uma lojinha pequena que não tinha muita preocupação com sua imagem como loja, e sim em enfatizar suas peças.  Com o crescimento da loja decidiram voltar os olhos para sua marca pessoal, com isso surgiu o projeto.  Com o nome sendo o maior diferencial, a ênfase da identidade se concentrou no & (e comercial), tornando ele o ícone da marca.  Um vermelho voltado para o bordô evidencia a paixão pelo feminino e a feminilidade em si. A tipografia estilizada e em caixa alta traz a sensação de empoderamento e maturidade, que é o que buscavam para a marca.   Todos os elementos, como Tag, caixas e sacolas foram desenvolvidos para criar uma unidade visual e identificar em cada parte da venda, quem é a loja e como ela se comunica.  ',
    images: [
      'projects/ecomercial/1.png',
      'projects/ecomercial/2.png',
      'projects/ecomercial/3.png',
      'projects/ecomercial/4.png',
      'projects/ecomercial/5.png',
      'projects/ecomercial/6.png',
      'projects/ecomercial/7.png',
      'projects/ecomercial/8.png',
      'projects/ecomercial/9.png',
      'projects/ecomercial/10.png',
    ],
  },
  {
    id: 5,
    title: 'Local GYM',
    category: 'Applicativos',
    content:
      'Local gym veio com a proposta de ser uma versão melhorada do gym pass, onde você não precisa pagar uma mensalidade, você pode comprar créditos direto pelo aplicativo e trocar esses créditos direto na academia escolhida, sem vínculo obrigatório.  As palavras chaves desse projetos foram “simples” e “comum”, a ideia não era chamar a atenção pelo visual e sim pelo funcional, e assim foi feito, com modo claro  escuro, com card que se destacam pelas sombras e não pelas cores e com uma usabilidade simples e extremamente funcional. ',
    images: [
      'projects/local_gym/1.png',
      'projects/local_gym/2.png',
      'projects/local_gym/3.png',
      'projects/local_gym/4.png',
      'projects/local_gym/5.png',
      'projects/local_gym/6.png',
      'projects/local_gym/7.png',
      'projects/local_gym/8.png',
      'projects/local_gym/9.png',
    ],
  },
  {
    id: 6,
    title: 'VisioMaq',
    category: 'Social Media',
    content:
      'Visiomaq é uma empresa de venda de empilhadeiras para grandes empresas de logística Com um nicho muito difícil, a Visiomaq pediu que as peças fossem diferenciadas de todos os perfis de referência, com uma linguagem mais jovial e que as empilhadeiras (principal produto) interagissem com o design em algumas peças. Com isso a ideia disruptiva era a base, com  faixas no meio da imagem, empilhadeira que levanta a eficiência e uma caixinha de instagram, uni as os desejos do cliente com um visual que cada peça conversar entre si e cria um storytellin por meio das cores base de cada imagem.  ',
    images: [
      'projects/visiomaq/1.png',
      'projects/visiomaq/2.png',
      'projects/visiomaq/3.png',
      'projects/visiomaq/4.png',
      'projects/visiomaq/5.jpg',
    ],
  },
  {
    id: 7,
    title: 'Casamento MaLu',
    category: 'Convite',
    content:
      'A Luciana e o Matheus têm personalidades bem diferentes, ela uma moça alegre e delicada e ele mais introspectivo e fechado; em suas palavras: como uma rosa negra e eles me pediram para trazer um pouco da personalidade dos dois no convite do casamento.  Pegando a idela de rosa negra, decidi ao formar a paleta de cores que o preto iria quebrar a sutileza do delicado que eu precisava transmitir e fui para o caminho de um azul profundo. A noiva gostava da cor rosa e pediu por ela, então já tinha duas cores base, e a partir daí  conectei elementos que inspiraram profundidade e delicadeza, inclusive na tipografia principal.  o Resultado foi um convite com nuances e a cara do casal ',
    images: [
      'projects/malu/1.jpg',
      'projects/malu/2.jpg',
      'projects/malu/3.png',
      'projects/malu/4.png',
    ],
  },
  {
    id: 8,
    title: 'Titulo titulo',
    category: 'Design',
    content: 'Conteúdo conteúdo conteúdo',
    images: ['projects/work-8.jpg'],
  },
];

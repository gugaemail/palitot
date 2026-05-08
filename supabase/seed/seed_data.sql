-- =============================================================
-- PALITOT · Seed de dados fictícios
-- Execute APÓS criar os usuários no Supabase Auth Dashboard
-- Substitua os UUIDs pelos IDs reais gerados no Auth
-- =============================================================

-- ⚠️  INSTRUÇÕES:
-- 1. Crie os usuários manualmente no Supabase Dashboard > Authentication > Users
--    - pedro@palitot.com.br  (será admin)
--    - ana@palitot.com.br
--    - carlos@palitot.com.br
-- 2. Copie os UUIDs gerados e substitua abaixo
-- 3. Execute este SQL no Supabase SQL Editor

-- Substitua estes UUIDs pelos reais:
do $$
declare
  pedro_id   uuid := 'SUBSTITUA_PELO_UUID_DO_PEDRO';
  ana_id     uuid := 'SUBSTITUA_PELO_UUID_DA_ANA';
  carlos_id  uuid := 'SUBSTITUA_PELO_UUID_DO_CARLOS';
  
  memoria_1  uuid := uuid_generate_v4();
  memoria_2  uuid := uuid_generate_v4();
  memoria_3  uuid := uuid_generate_v4();
  memoria_4  uuid := uuid_generate_v4();
begin

  -- Atualizar perfis (criados automaticamente pelo trigger)
  update profiles set name = 'Pedro Palitot', role = 'admin'
  where id = pedro_id;
  
  update profiles set name = 'Ana Palitot', role = 'member'
  where id = ana_id;
  
  update profiles set name = 'Carlos Palitot', role = 'member'
  where id = carlos_id;

  -- =============================================================
  -- MEMÓRIAS
  -- =============================================================

  insert into memories (id, slug, title, content, excerpt, happened_at, location, author_id, is_published)
  values
  (
    memoria_1,
    'primeira-viagem-ao-mar',
    'Nossa primeira viagem ao mar',
    'Mãe acordou às cinco da manhã para preparar a marmita. Ovos cozidos, pão de queijo que ela tinha feito na véspera, e aquela limonada que só ela sabe fazer — doce no ponto certo, com raspadinha de limão na borda do copo.

O carro ainda cheirava a protetor solar quando saímos. Pai dirigia, e ela ficava virada pra trás checando se a gente estava com cinto. Cada vez que a gente fingia que não estava, ela fazia aquela cara séria que a gente sabia que era mentira.

Quando chegamos na praia, ela entrou no mar de vestido, como sempre fazia. Não ligava para mais nada. Só ria. Um riso que eu nunca mais ouvi igual — aquele riso quando ela está completamente presente, completamente feliz.

Guardei aquele dia dentro de mim como se fosse um presente. Ainda guardo.',
    'Mãe acordou às cinco da manhã para preparar a marmita. O carro ainda cheirava a protetor solar quando chegamos. Ela entrou no mar de vestido, como sempre, e riu de um jeito que eu nunca mais ouvi igual.',
    '1994-01-15',
    'Praia de Tambaba, Paraíba',
    pedro_id,
    true
  ),
  (
    memoria_2,
    'natal-de-2001',
    'O natal que cheirava a bolo de rolo',
    'Naquele ano ela resolveu aprender a fazer bolo de rolo. Passou a semana toda tentando acertar a massa — fina, fininha, que não pode rasgar na hora de enrolar. Nas primeiras tentativas rasgava toda. Ela ria de si mesma, jogava fora e tentava de novo.

Na véspera de Natal, às onze da noite, a casa inteira cheirava a canela e goiabada. Ela tinha conseguido. Doze rolinhos perfeitos, embrulhados no papel manteiga com um laço vermelho.

Nenhum presente debaixo da árvore chegou perto daquilo.

Foi o primeiro ano que ela nos ensinou a fazer junto. Hoje Ana ainda faz toda festa. A receita está escrita à mão no caderno dela.',
    'Naquele ano ela resolveu aprender a fazer bolo de rolo. Na véspera de Natal, às onze da noite, a casa inteira cheirava a canela e goiabada.',
    '2001-12-24',
    'Casa da família, João Pessoa',
    ana_id,
    true
  ),
  (
    memoria_3,
    'o-jardim-dela',
    'O jardim que ela plantou durante anos',
    'Ela começou o jardim com três vasos numa varanda pequena. Um de orquídea roxa, um de antúrio vermelho, e um de samambaia que já estava quase morta quando ganhou de vizinha.

Em vinte anos, o jardim tomou o quintal inteiro.

Eu nunca entendi como ela sabia o que cada planta precisava. Água demais ou de menos, sol da manhã ou da tarde, terra mais grossa ou mais fina. Ela chegava no quintal e simplesmente sabia.

Certa vez perguntei o segredo. Ela pensou um pouco e disse: "Você precisa prestar atenção. As plantas falam. Você só precisa aprender a ouvir."

Acho que é assim que ela cuida de tudo — da gente incluso.',
    'Ela começou com três vasos e em vinte anos o jardim tomou o quintal inteiro. Quando perguntei o segredo, ela disse: "As plantas falam. Você só precisa aprender a ouvir."',
    '2015-09-20',
    'Casa da família, João Pessoa',
    carlos_id,
    true
  ),
  (
    memoria_4,
    'cafe-da-manha-de-domingo',
    'Os cafés da manhã de domingo',
    'Não era o café que importava. Era o ritual.

Todo domingo, sem exceção, ela colocava a toalha bordada na mesa. A que ela mesma bordou antes de a gente nascer, com flores amarelas nas bordas. Só saía nas ocasiões especiais — e o domingo era sempre ocasião especial para ela.

Tinha tapioca. Tinha cuscuz. Tinha aquele queijo coalho que ela buscava na feira na sexta-feira. E sempre tinha uma fruta da estação cortada em fatias finas, arrumada em leque no prato.

A gente cresceu, saiu de casa, voltava nos fins de semana. A toalha ainda estava lá. O queijo coalho ainda estava lá. Ela ainda estava lá.

Esses cafés da manhã são o lar. São onde a família é família.',
    'Todo domingo, sem exceção, ela colocava a toalha bordada na mesa. A gente cresceu, saiu de casa, voltava nos fins de semana. A toalha ainda estava lá.',
    '2020-05-10',
    'Casa da família, João Pessoa',
    pedro_id,
    true
  );

  -- =============================================================
  -- COMENTÁRIOS
  -- =============================================================

  insert into comments (memory_id, author_id, content)
  values
  (memoria_1, ana_id,    'Esse dia! Me lembro da limonada dela ser a melhor coisa do mundo. Precisamos voltar lá algum dia.'),
  (memoria_1, carlos_id, 'Eu ainda tenho uma foto dessa viagem em algum lugar. Preciso digitalizar e subir aqui.'),
  (memoria_2, pedro_id,  'Ana, você ainda faz esse bolo igualzinho o dela. É incrível.'),
  (memoria_2, carlos_id, 'Eu ainda sinto o cheiro daquela cozinha na véspera de Natal toda vez que vejo goiabada.'),
  (memoria_3, ana_id,    'O jardim dela é lindo demais. Fui semana passada e a orquídea roxa floresceu de novo.'),
  (memoria_4, ana_id,    'A toalha bordada! Ela ainda usa toda semana. É um tesouro.'),
  (memoria_4, carlos_id, 'Esses cafés da manhã são meu lugar favorito no mundo. Simples assim.');

  -- =============================================================
  -- MENSAGENS DO MURAL
  -- =============================================================

  insert into mural_messages (author_id, content, is_featured)
  values
  (pedro_id,  'Mãe, obrigado por cada vez que você ficou acordada esperando a gente chegar. Por cada sopa quando a gente estava doente. Por cada conversa às três da manhã quando a vida pesava. Você é a raiz de tudo que somos.', true),
  (ana_id,    'Você me ensinou que cuidar é um ato de coragem. Que amor de verdade aparece nas pequenas coisas — na marmita de madrugada, no vestido no mar, na toalha bordada todo domingo. Te amo mais do que cabe em palavras.', true),
  (carlos_id, 'Toda planta do seu jardim lembra de você. Toda receita que aprendi lembra de você. Cada domingo em família lembra de você. Feliz Dia das Mães, mãe.', false);

end $$;

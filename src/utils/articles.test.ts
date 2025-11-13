import { describe, expect, it } from 'vitest';

import { articlesSort, githubArticlePath } from './articles';

describe('articles utils', () => {
  describe('articlesSort', () => {
    it('debe ordenar artículos de más reciente a más antiguo', () => {
      const articles = [
        { frontmatter: { date: '2024-01-01T00:00:00Z' } },
        { frontmatter: { date: '2024-03-01T00:00:00Z' } },
        { frontmatter: { date: '2024-02-01T00:00:00Z' } },
      ];

      const sorted = [...articles].sort(articlesSort);

      expect(sorted).toEqual([
        { frontmatter: { date: '2024-03-01T00:00:00Z' } },
        { frontmatter: { date: '2024-02-01T00:00:00Z' } },
        { frontmatter: { date: '2024-01-01T00:00:00Z' } },
      ]);
    });

    it('debe manejar artículos con la misma fecha', () => {
      const articles = [
        { frontmatter: { date: '2024-01-01T00:00:00Z' } },
        { frontmatter: { date: '2024-01-01T00:00:00Z' } },
      ];

      const sorted = [...articles].sort(articlesSort);

      expect(sorted).toEqual([
        { frontmatter: { date: '2024-01-01T00:00:00Z' } },
        { frontmatter: { date: '2024-01-01T00:00:00Z' } },
      ]);
    });

    it('debe manejar un solo artículo', () => {
      const articles = [{ frontmatter: { date: '2024-01-01T00:00:00Z' } }];

      const sorted = [...articles].sort(articlesSort);

      expect(sorted).toEqual([{ frontmatter: { date: '2024-01-01T00:00:00Z' } }]);
    });

    it('debe manejar array vacío', () => {
      const articles: Array<{ frontmatter: { date: string } }> = [];

      const sorted = [...articles].sort(articlesSort);

      expect(sorted).toEqual([]);
    });

    it('debe ordenar correctamente fechas con diferentes formatos válidos', () => {
      const articles = [
        { frontmatter: { date: '2024-01-15T10:30:00-03:00' } },
        { frontmatter: { date: '2024-01-15T14:30:00Z' } },
        { frontmatter: { date: '2024-01-15T08:00:00+01:00' } },
      ];

      const sorted = [...articles].sort(articlesSort);

      // Las fechas deben estar ordenadas correctamente según su timestamp UTC
      expect(new Date(sorted[0].frontmatter.date).getTime()).toBeGreaterThanOrEqual(
        new Date(sorted[1].frontmatter.date).getTime(),
      );
      expect(new Date(sorted[1].frontmatter.date).getTime()).toBeGreaterThanOrEqual(
        new Date(sorted[2].frontmatter.date).getTime(),
      );
    });

    it('debe ordenar artículos que abarcan múltiples años', () => {
      const articles = [
        { frontmatter: { date: '2022-12-31T23:59:59Z' } },
        { frontmatter: { date: '2024-01-01T00:00:00Z' } },
        { frontmatter: { date: '2023-06-15T12:00:00Z' } },
      ];

      const sorted = [...articles].sort(articlesSort);

      expect(sorted).toEqual([
        { frontmatter: { date: '2024-01-01T00:00:00Z' } },
        { frontmatter: { date: '2023-06-15T12:00:00Z' } },
        { frontmatter: { date: '2022-12-31T23:59:59Z' } },
      ]);
    });
  });

  describe('githubArticlePath', () => {
    it('debe generar la URL correcta para editar un artículo en GitHub', () => {
      const path = 'mi-articulo';
      const expected = 'https://github.com/proskynete/website/edit/main/src/pages/articulos/mi-articulo.mdx';

      const result = githubArticlePath(path);

      expect(result).toBe(expected);
    });

    it('debe generar la URL correcta para diferentes paths', () => {
      const paths = [
        'como-usar-react-hooks',
        'typescript-para-principiantes',
        'introduccion-a-astro',
      ];

      const results = paths.map(githubArticlePath);

      expect(results).toEqual([
        'https://github.com/proskynete/website/edit/main/src/pages/articulos/como-usar-react-hooks.mdx',
        'https://github.com/proskynete/website/edit/main/src/pages/articulos/typescript-para-principiantes.mdx',
        'https://github.com/proskynete/website/edit/main/src/pages/articulos/introduccion-a-astro.mdx',
      ]);
    });

    it('debe manejar paths con caracteres especiales', () => {
      const path = 'mi-articulo-con-números-123';
      const expected = 'https://github.com/proskynete/website/edit/main/src/pages/articulos/mi-articulo-con-números-123.mdx';

      const result = githubArticlePath(path);

      expect(result).toBe(expected);
    });

    it('debe manejar path vacío', () => {
      const path = '';
      const expected = 'https://github.com/proskynete/website/edit/main/src/pages/articulos/.mdx';

      const result = githubArticlePath(path);

      expect(result).toBe(expected);
    });

    it('debe concatenar correctamente sin dobles slashes', () => {
      const path = 'test-article';
      const result = githubArticlePath(path);

      // Verificar que no hay dobles slashes en el resultado (excepto en https://)
      const withoutProtocol = result.replace('https://', '');
      expect(withoutProtocol).not.toMatch(/\/\//);
    });
  });
});

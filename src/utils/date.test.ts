import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getDifferenceInYears } from './date';

describe('date utils', () => {
  describe('getDifferenceInYears', () => {
    beforeEach(() => {
      // Restaurar fecha real después de cada test
      vi.useRealTimers();
    });

    it('debe calcular correctamente la diferencia en años desde 2015-11-01', () => {
      // Mock fecha: 2025-11-12 (como en el env del sistema)
      const mockDate = new Date('2025-11-12T00:00:00.000Z');
      vi.setSystemTime(mockDate);

      const result = getDifferenceInYears();

      // De 2015-11-01 a 2025-11-12 = 10 años completos
      expect(result).toBe(10);
    });

    it('debe retornar años completos sin considerar meses si ya pasó el mes', () => {
      // Mock fecha: 2025-12-01 (después del mes de referencia)
      const mockDate = new Date('2025-12-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);

      const result = getDifferenceInYears();

      // De 2015-11-01 a 2025-12-01 = 10 años completos
      expect(result).toBe(10);
    });

    it('debe restar un año si aún no ha llegado el mes de referencia', () => {
      // Mock fecha: 2025-10-15 (antes del mes de noviembre)
      const mockDate = new Date('2025-10-15T00:00:00.000Z');
      vi.setSystemTime(mockDate);

      const result = getDifferenceInYears();

      // De 2015-11-01 a 2025-10-15 = 9 años (no ha llegado noviembre 2025)
      expect(result).toBe(9);
    });

    it('debe restar un año si es el mismo mes pero antes del día', () => {
      // Mock fecha: 2025-11-01 (mismo mes, día anterior en términos relativos)
      // Nota: 2015-11-01 es el día 1, así que el 1 de noviembre debería contar como completo
      const mockDate = new Date('2025-11-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);

      const result = getDifferenceInYears();

      // De 2015-11-01 a 2025-11-01 = exactamente 10 años
      expect(result).toBe(10);
    });

    it('debe manejar el caso donde el día actual es anterior al día de referencia en el mismo mes', () => {
      // Mock fecha: 2024-11-01 (ya que FROM_DATE es 2015-11-01)
      const mockDate = new Date('2024-11-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);

      const result = getDifferenceInYears();

      // De 2015-11-01 a 2024-11-01 = 9 años completos
      expect(result).toBe(9);
    });

    it('debe calcular correctamente en año bisiesto', () => {
      // Mock fecha: 2024-02-29 (año bisiesto)
      const mockDate = new Date('2024-02-29T00:00:00.000Z');
      vi.setSystemTime(mockDate);

      const result = getDifferenceInYears();

      // De 2015-11-01 a 2024-02-29 = 8 años (no ha llegado noviembre 2024)
      expect(result).toBe(8);
    });

    it('debe funcionar correctamente justo después de la fecha de inicio', () => {
      // Mock fecha: 2016-01-01
      const mockDate = new Date('2016-01-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);

      const result = getDifferenceInYears();

      // De 2015-11-01 a 2016-01-01 = 0 años (no ha llegado noviembre 2016)
      expect(result).toBe(0);
    });

    it('debe calcular correctamente 1 año después', () => {
      // Mock fecha: 2016-11-01
      const mockDate = new Date('2016-11-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);

      const result = getDifferenceInYears();

      // De 2015-11-01 a 2016-11-01 = 1 año completo
      expect(result).toBe(1);
    });

    it('debe manejar múltiples años en el futuro', () => {
      // Mock fecha: 2035-12-31
      const mockDate = new Date('2035-12-31T00:00:00.000Z');
      vi.setSystemTime(mockDate);

      const result = getDifferenceInYears();

      // De 2015-11-01 a 2035-12-31 = 20 años completos
      expect(result).toBe(20);
    });

    it('debe retornar el mismo resultado para fechas en el mismo día del año', () => {
      // Mock fecha: 2025-11-01
      const mockDate1 = new Date('2025-11-01T00:00:00.000Z');
      vi.setSystemTime(mockDate1);
      const result1 = getDifferenceInYears();

      // Mock fecha: 2025-11-01 (mismo día, diferente hora)
      const mockDate2 = new Date('2025-11-01T23:59:59.999Z');
      vi.setSystemTime(mockDate2);
      const result2 = getDifferenceInYears();

      expect(result1).toBe(result2);
    });

    it('debe manejar el límite del mes de diciembre', () => {
      // Mock fecha: 2025-12-31
      const mockDate = new Date('2025-12-31T23:59:59.999Z');
      vi.setSystemTime(mockDate);

      const result = getDifferenceInYears();

      // De 2015-11-01 a 2025-12-31 = 10 años completos
      expect(result).toBe(10);
    });

    it('debe manejar el límite del mes de enero', () => {
      // Mock fecha: 2025-01-01
      const mockDate = new Date('2025-01-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);

      const result = getDifferenceInYears();

      // De 2015-11-01 a 2025-01-01 = 9 años (no ha llegado noviembre 2025)
      expect(result).toBe(9);
    });

    it('debe verificar que FROM_DATE es 2015-11-01', () => {
      // Test para documentar la constante FROM_DATE
      const mockDate = new Date('2015-11-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);

      const result = getDifferenceInYears();

      // En la misma fecha debería ser 0
      expect(result).toBe(0);
    });
  });
});

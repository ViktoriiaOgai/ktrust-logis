import { contentService } from '../services/contentService.js';

class ContentController {
  // Получить все услуги
  async getAllServices(req, res) {
    try {
      const services = await contentService.getAllServices();
      res.json({
        success: true,
        data: services
      });
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении услуг',
        error: error.message
      });
    }
  }

  // Получить услугу по slug
  async getServiceBySlug(req, res) {
    try {
      const { slug } = req.params;
      const service = await contentService.getServiceBySlug(slug);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Услуга не найдена'
        });
      }

      res.json({
        success: true,
        data: service
      });
    } catch (error) {
      console.error('Error fetching service:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении услуги',
        error: error.message
      });
    }
  }

  // Получить тарифы для услуги
  async getTariffs(req, res) {
    try {
      const { slug } = req.params;
      const { country } = req.query;

      const tariffs = await contentService.getTariffs(slug, country);

      console.log('Tariffs from service:', tariffs);

      // Получаем строки для каждого тарифа
      const tariffsWithRows = await Promise.all(
        tariffs.map(async (tariff) => {
          const tariffWithRows = await contentService.getTariffWithRows(tariff.id);
          console.log('Tariff with rows:', tariffWithRows);
          return tariffWithRows;
        })
      );

      console.log('Final tariffs with rows:', tariffsWithRows);

      res.json({
        success: true,
        data: tariffsWithRows
      });
    } catch (error) {
      console.error('Error fetching tariffs:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении тарифов',
        error: error.message
      });
    }
  }

  // Получить все страны
  async getAllCountries(req, res) {
    try {
      const countries = await contentService.getAllCountries();
      res.json({
        success: true,
        data: countries
      });
    } catch (error) {
      console.error('Error fetching countries:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении стран',
        error: error.message
      });
    }
  }

  // Получить сравнение услуг
  async getServiceComparison(req, res) {
    try {
      const { serviceSlug } = req.params;
      const comparison = await contentService.getServiceComparison(serviceSlug);

      if (!comparison) {
        return res.status(404).json({
          success: false,
          message: 'Сравнение не найдено'
        });
      }

      res.json({
        success: true,
        data: comparison
      });
    } catch (error) {
      console.error('Error fetching comparison:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении сравнения',
        error: error.message
      });
    }
  }

  // Получить информацию о компании
  async getCompanyInfo(req, res) {
    try {
      const { section } = req.params;
      const info = await contentService.getCompanyInfo(section);

      if (!info) {
        return res.status(404).json({
          success: false,
          message: 'Информация не найдена'
        });
      }

      res.json({
        success: true,
        data: info
      });
    } catch (error) {
      console.error('Error fetching company info:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении информации',
        error: error.message
      });
    }
  }

  // Создать услугу (Admin only)
  async createService(req, res) {
    try {
      const service = await contentService.createService(req.body);
      res.status(201).json({
        success: true,
        data: service
      });
    } catch (error) {
      console.error('Error creating service:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании услуги',
        error: error.message
      });
    }
  }

  // Обновить услугу (Admin only)
  async updateService(req, res) {
    try {
      const { id } = req.params;
      const service = await contentService.updateService(id, req.body);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Услуга не найдена'
        });
      }

      res.json({
        success: true,
        data: service
      });
    } catch (error) {
      console.error('Error updating service:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении услуги',
        error: error.message
      });
    }
  }

  // Создать тариф (Admin only)
  async createTariff(req, res) {
    try {
      const tariff = await contentService.createTariff(req.body);
      res.status(201).json({
        success: true,
        data: tariff
      });
    } catch (error) {
      console.error('Error creating tariff:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании тарифа',
        error: error.message
      });
    }
  }

  // Создать строку тарифа (Admin only)
  async createTariffRow(req, res) {
    try {
      const row = await contentService.createTariffRow(req.body);
      res.status(201).json({
        success: true,
        data: row
      });
    } catch (error) {
      console.error('Error creating tariff row:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании строки тарифа',
        error: error.message
      });
    }
  }

  // Обновить информацию о компании (Admin only)
  async updateCompanyInfo(req, res) {
    try {
      const { section } = req.params;
      const info = await contentService.updateCompanyInfo(section, req.body);

      res.json({
        success: true,
        data: info
      });
    } catch (error) {
      console.error('Error updating company info:', error);
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении информации',
        error: error.message
      });
    }
  }
}

const contentController = new ContentController();
export { contentController };

// API 服务

// 基础 URL
const BASE_URL = 'https://api.redagri.com';

// 模拟延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 导入本地图片
import strawberrySrc from '../assets/strawberry.png';
import youziSrc from '../assets/youzi.png';
import orangeSrc from '../assets/orange.jpg';

// 模拟产品数据
const mockProducts = [
  {
    id: 1,
    name: '有机草莓',
    price: 28,
    subsidy: 8,
    公益说明: '每购买一盒草莓，将为老区果农提供8元的生产补贴',
    image: strawberrySrc,
    规格: '500g/盒',
    详细描述: '来自革命老区的有机草莓，采用绿色种植方法，不使用化肥和农药，果实饱满，口感鲜美。'
  },
  {
    id: 2,
    name: '红心柚子',
    price: 38,
    subsidy: 5,
    公益说明: '每购买一个柚子，将为山区柚农提供5元的生产补贴',
    image: youziSrc,
    规格: '2.5kg/个',
    详细描述: '来自深山的红心柚子，果肉饱满，口感清甜多汁，营养丰富。'
  },
  {
    id: 3,
    name: '赣南脐橙',
    price: 29,
    subsidy: 10,
    公益说明: '每购买一箱脐橙，将为当地果农提供10元的生活补贴',
    image: orangeSrc,
    规格: '5kg/箱',
    详细描述: '来自赣南老区的脐橙，果实饱满，果皮薄，果肉细嫩多汁，口感清甜。'
  }
];

// 模拟溯源数据
const mockTraceabilityData = {
  story: {
    title: '红色故事',
    content: '在革命老区，有一位老党员王大爷，他始终坚持用传统方法种植有机大米。通过红银兴农平台，他的大米不仅卖出了好价钱，还带动了周边农户共同致富。每一粒大米都承载着红色基因和对美好生活的向往。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20revolutionary%20story%20with%20farmer%20and%20rice%20field&image_size=portrait_4_3'
  },
  farmer: {
    name: '王建国',
    address: '革命老区红安县',
    plantingArea: '10亩',
    plantingYears: '20年',
    contact: '138****1234'
  },
  fund: {
    productPrice: 50.00,
    farmerIncome: 35.00,
    farmerIncomePercentage: 70,
    platformOperation: 5.00,
    platformOperationPercentage: 10,
    publicWelfareFund: 10.00,
    publicWelfareFundPercentage: 20,
    note: '公益基金将用于支持当地教育和基础设施建设。'
  }
};

// 模拟公益成果数据
const mockAchievementData = {
  totalSales: 1234567,
  farmerIncome: 892345,
  volunteerHours: 12345
};

// API 方法
export const api = {
  // 获取产品列表
  async getProducts() {
    try {
      // 模拟API请求延迟
      await delay(500);
      return {
        success: true,
        data: mockProducts
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // 获取产品详情
  async getProductDetail(id) {
    try {
      await delay(300);
      const product = mockProducts.find(p => p.id === parseInt(id));
      if (product) {
        return {
          success: true,
          data: product
        };
      } else {
        return {
          success: false,
          error: '产品不存在'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // 获取溯源信息
  async getTraceabilityData() {
    try {
      await delay(400);
      return {
        success: true,
        data: mockTraceabilityData
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // 获取公益成果数据
  async getAchievementData() {
    try {
      await delay(300);
      return {
        success: true,
        data: mockAchievementData
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // 登录
  async login(role) {
    try {
      await delay(500);
      const fakeUsers = {
        volunteer: { id: 1, name: '志愿者', role: 'volunteer' },
        farmer: { id: 2, name: '农户', role: 'farmer' },
        consumer: { id: 3, name: '消费者', role: 'consumer' }
      };
      const user = fakeUsers[role];
      if (user) {
        return {
          success: true,
          data: user
        };
      } else {
        return {
          success: false,
          error: '角色不存在'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // 提交订单
  async submitOrder(orderData) {
    try {
      await delay(800);
      return {
        success: true,
        data: {
          orderId: Date.now(),
          ...orderData
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

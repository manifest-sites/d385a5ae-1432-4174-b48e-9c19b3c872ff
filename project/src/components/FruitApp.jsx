import { useState, useEffect } from 'react'
import { Button, Card, Input, Select, Modal, Form, Row, Col, Tag, Space, Typography, message, Drawer } from 'antd'
import { PlusOutlined, HeartOutlined, HeartFilled, InfoCircleOutlined } from '@ant-design/icons'
import { Fruit } from '../entities/Fruit'

const { Option } = Select
const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const defaultFruits = [
  {
    name: 'Apple',
    color: 'Red',
    taste: 'Sweet-Tart',
    season: 'Fall',
    description: 'Crisp and refreshing fruit perfect for snacking',
    nutritionFacts: 'High in fiber, vitamin C, and antioxidants',
    isFavorite: false,
    emoji: '🍎'
  },
  {
    name: 'Banana',
    color: 'Yellow',
    taste: 'Sweet',
    season: 'Year-round',
    description: 'Soft, sweet tropical fruit rich in potassium',
    nutritionFacts: 'Excellent source of potassium, vitamin B6, and fiber',
    isFavorite: false,
    emoji: '🍌'
  },
  {
    name: 'Orange',
    color: 'Orange',
    taste: 'Sweet-Citrus',
    season: 'Winter',
    description: 'Juicy citrus fruit bursting with vitamin C',
    nutritionFacts: 'High in vitamin C, folate, and antioxidants',
    isFavorite: false,
    emoji: '🍊'
  },
  {
    name: 'Strawberry',
    color: 'Red',
    taste: 'Sweet',
    season: 'Summer',
    description: 'Small, sweet berry perfect for desserts',
    nutritionFacts: 'Rich in vitamin C, manganese, and antioxidants',
    isFavorite: false,
    emoji: '🍓'
  }
]

function FruitApp() {
  const [fruits, setFruits] = useState([])
  const [filteredFruits, setFilteredFruits] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSeason, setFilterSeason] = useState('all')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedFruit, setSelectedFruit] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [form] = Form.useForm()

  const loadFruits = async () => {
    try {
      const result = await Fruit.list()
      if (result.success && result.data.length > 0) {
        setFruits(result.data)
      } else {
        await initializeDefaultFruits()
      }
    } catch (error) {
      console.error('Failed to load fruits:', error)
      await initializeDefaultFruits()
    }
  }

  const initializeDefaultFruits = async () => {
    try {
      for (const fruit of defaultFruits) {
        await Fruit.create(fruit)
      }
      loadFruits()
    } catch (error) {
      console.error('Failed to initialize default fruits:', error)
      setFruits(defaultFruits)
    }
  }

  const addFruit = async (values) => {
    try {
      const result = await Fruit.create(values)
      if (result.success) {
        message.success('Fruit added successfully!')
        setIsModalVisible(false)
        form.resetFields()
        loadFruits()
      }
    } catch (error) {
      message.error('Failed to add fruit')
    }
  }

  const toggleFavorite = async (fruit) => {
    try {
      const result = await Fruit.update(fruit._id, { ...fruit, isFavorite: !fruit.isFavorite })
      if (result.success) {
        loadFruits()
        message.success(fruit.isFavorite ? 'Removed from favorites' : 'Added to favorites')
      }
    } catch (error) {
      message.error('Failed to update favorite status')
    }
  }

  const showFruitDetails = (fruit) => {
    setSelectedFruit(fruit)
    setDrawerVisible(true)
  }

  useEffect(() => {
    loadFruits()
  }, [])

  useEffect(() => {
    let filtered = fruits.filter(fruit =>
      fruit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fruit.taste.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fruit.color.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (filterSeason !== 'all') {
      filtered = filtered.filter(fruit => fruit.season === filterSeason)
    }

    setFilteredFruits(filtered)
  }, [fruits, searchTerm, filterSeason])

  const seasons = ['Spring', 'Summer', 'Fall', 'Winter', 'Year-round']
  const tastes = ['Sweet', 'Sour', 'Tart', 'Sweet-Tart', 'Sweet-Citrus', 'Bitter']

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Title level={1} className="text-green-800 mb-2">🍎 Fruit Explorer 🍌</Title>
          <Text className="text-gray-600 text-lg">Discover, learn about, and collect your favorite fruits!</Text>
        </div>

        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input.Search
                placeholder="Search fruits by name, taste, or color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
                size="large"
              />
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Select
                value={filterSeason}
                onChange={setFilterSeason}
                size="large"
                style={{ width: '100%' }}
                placeholder="Filter by season"
              >
                <Option value="all">All Seasons</Option>
                {seasons.map(season => (
                  <Option key={season} value={season}>{season}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={4} md={6}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
                size="large"
                className="w-full bg-green-600 border-green-600 hover:bg-green-700"
              >
                Add Fruit
              </Button>
            </Col>
          </Row>
        </div>

        <Row gutter={[16, 16]}>
          {filteredFruits.map((fruit) => (
            <Col xs={24} sm={12} md={8} lg={6} key={fruit._id || fruit.name}>
              <Card
                hoverable
                className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                cover={
                  <div className="bg-gradient-to-br from-green-100 to-yellow-100 p-8 text-center">
                    <div className="text-6xl mb-2">{fruit.emoji || '🍎'}</div>
                    <Title level={4} className="text-green-800 mb-0">{fruit.name}</Title>
                  </div>
                }
                actions={[
                  <Button
                    type="text"
                    icon={fruit.isFavorite ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                    onClick={() => toggleFavorite(fruit)}
                    className="border-none"
                  />,
                  <Button
                    type="text"
                    icon={<InfoCircleOutlined />}
                    onClick={() => showFruitDetails(fruit)}
                    className="border-none"
                  />
                ]}
              >
                <Space direction="vertical" className="w-full">
                  <div>
                    <Tag color="blue">{fruit.season}</Tag>
                    <Tag color="green">{fruit.taste}</Tag>
                  </div>
                  <Text type="secondary" className="line-clamp-2">{fruit.description}</Text>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 border-gray-300`} 
                         style={{ backgroundColor: fruit.color.toLowerCase() }}></div>
                    <Text className="text-sm">{fruit.color}</Text>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredFruits.length === 0 && (
          <div className="text-center py-12">
            <Title level={3} type="secondary">No fruits found</Title>
            <Text type="secondary">Try adjusting your search or filters, or add a new fruit!</Text>
          </div>
        )}

        <Modal
          title="Add New Fruit"
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false)
            form.resetFields()
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={addFruit}
            initialValues={{ isFavorite: false }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Fruit Name"
                  rules={[{ required: true, message: 'Please enter fruit name' }]}
                >
                  <Input placeholder="e.g., Mango" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="emoji"
                  label="Emoji"
                  rules={[{ required: false }]}
                >
                  <Input placeholder="🥭" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="color"
                  label="Color"
                  rules={[{ required: true, message: 'Please enter color' }]}
                >
                  <Input placeholder="e.g., Orange" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="taste"
                  label="Taste"
                  rules={[{ required: true, message: 'Please select taste' }]}
                >
                  <Select placeholder="Select taste profile">
                    {tastes.map(taste => (
                      <Option key={taste} value={taste}>{taste}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="season"
              label="Best Season"
              rules={[{ required: false }]}
            >
              <Select placeholder="Select season">
                {seasons.map(season => (
                  <Option key={season} value={season}>{season}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: false }]}
            >
              <TextArea rows={3} placeholder="Brief description of the fruit..." />
            </Form.Item>
            <Form.Item
              name="nutritionFacts"
              label="Nutrition Facts"
              rules={[{ required: false }]}
            >
              <TextArea rows={2} placeholder="Key nutritional benefits..." />
            </Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" className="bg-green-600 border-green-600">
                Add Fruit
              </Button>
            </div>
          </Form>
        </Modal>

        <Drawer
          title={selectedFruit?.name || 'Fruit Details'}
          placement="right"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={400}
        >
          {selectedFruit && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-8xl mb-4">{selectedFruit.emoji || '🍎'}</div>
                <Title level={2} className="text-green-800">{selectedFruit.name}</Title>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Text strong>Color: </Text>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-6 h-6 rounded-full border-2 border-gray-300`} 
                         style={{ backgroundColor: selectedFruit.color.toLowerCase() }}></div>
                    <Text>{selectedFruit.color}</Text>
                  </div>
                </div>
                
                <div>
                  <Text strong>Taste: </Text>
                  <Tag color="green" className="ml-2">{selectedFruit.taste}</Tag>
                </div>
                
                <div>
                  <Text strong>Best Season: </Text>
                  <Tag color="blue" className="ml-2">{selectedFruit.season}</Tag>
                </div>
                
                {selectedFruit.description && (
                  <div>
                    <Text strong>Description:</Text>
                    <Paragraph className="mt-1">{selectedFruit.description}</Paragraph>
                  </div>
                )}
                
                {selectedFruit.nutritionFacts && (
                  <div>
                    <Text strong>Nutrition Facts:</Text>
                    <Paragraph className="mt-1">{selectedFruit.nutritionFacts}</Paragraph>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button
                    type={selectedFruit.isFavorite ? "primary" : "default"}
                    icon={selectedFruit.isFavorite ? <HeartFilled /> : <HeartOutlined />}
                    onClick={() => toggleFavorite(selectedFruit)}
                    className={selectedFruit.isFavorite ? "bg-red-500 border-red-500" : ""}
                    block
                  >
                    {selectedFruit.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </div>
  )
}

export default FruitApp
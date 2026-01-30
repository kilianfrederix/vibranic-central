import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Create demo app with API key
    const demoApp = await prisma.app.upsert({
        where: { id: 'demo-app' },
        update: {},
        create: {
            id: 'demo-app',
            name: 'Demo App',
            description: 'A demo application showing Vibranic integration',
            externalUrl: 'http://localhost:3000/demo-app',
            apiKey: 'demo-app-api-key', // Use this in the demo app
        }
    })
    console.log('✅ Created demo app:', demoApp.name)

    // Create CRM app
    const crmApp = await prisma.app.upsert({
        where: { id: 'crm' },
        update: {},
        create: {
            id: 'crm',
            name: 'CRM',
            description: 'Customer management',
            externalUrl: 'https://crm.example.com',
        }
    })
    console.log('✅ Created CRM app:', crmApp.name)

    // Create Billing app
    const billingApp = await prisma.app.upsert({
        where: { id: 'billing' },
        update: {},
        create: {
            id: 'billing',
            name: 'Billing',
            description: 'Payments & subscriptions',
            externalUrl: 'https://billing.example.com',
        }
    })
    console.log('✅ Created Billing app:', billingApp.name)

    // Create some sample diagnostic events for demo
    console.log('📊 Creating sample diagnostic events...')

    const sampleEvents = [
        {
            appId: 'demo-app',
            type: 'info',
            severity: 'low',
            message: 'Application started successfully',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        },
        {
            appId: 'demo-app',
            type: 'warning',
            severity: 'medium',
            message: 'High memory usage detected',
            details: { memoryUsage: '85%', threshold: '80%' },
            timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
        },
        {
            appId: 'crm',
            type: 'error',
            severity: 'high',
            message: 'Failed to sync customer data',
            details: { errorCode: 'SYNC_FAILED', customerId: '12345' },
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        },
        {
            appId: 'billing',
            type: 'info',
            severity: 'low',
            message: 'Payment processed successfully',
            details: { amount: 99.99, currency: 'USD' },
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        },
    ]

    for (const event of sampleEvents) {
        await prisma.diagnosticEvent.create({ data: event })
    }
    console.log(`✅ Created ${sampleEvents.length} sample events`)

    // Create some sample metrics
    console.log('📈 Creating sample metrics...')

    const now = Date.now()
    const sampleMetrics = []

    // Create 24 hours of data points
    for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now - 1000 * 60 * 60 * i) // Each hour

        sampleMetrics.push(
            {
                appId: 'demo-app',
                metricKey: 'activeUsers',
                value: Math.floor(Math.random() * 100 + 50),
                unit: 'count',
                timestamp,
            },
            {
                appId: 'demo-app',
                metricKey: 'responseTime',
                value: Math.random() * 200 + 100,
                unit: 'ms',
                timestamp,
            },
            {
                appId: 'crm',
                metricKey: 'activeUsers',
                value: Math.floor(Math.random() * 50 + 20),
                unit: 'count',
                timestamp,
            }
        )
    }

    await prisma.metricSnapshot.createMany({
        data: sampleMetrics,
    })
    console.log(`✅ Created ${sampleMetrics.length} sample metrics`)

    console.log('🎉 Database seed completed!')
    console.log('\n📝 API Keys generated:')
    console.log(`   Demo App: demo-app-api-key`)
    console.log(`   CRM: ${crmApp.apiKey}`)
    console.log(`   Billing: ${billingApp.apiKey}`)
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

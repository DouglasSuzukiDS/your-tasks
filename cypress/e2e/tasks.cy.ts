describe('Tasks API', () => {
   const apiUrl = '/api'
   let token: string
   let taskId: number

   before(() => {
      // Cria usuário e faz login para obter token
      const email = `taskuser_${Date.now()}@mail.com`
      const password = 'testpassword'
      cy.request('POST', `${apiUrl}/auth/register`, {
         name: 'Task User',
         email,
         password
      }).then(() => {
         cy.request('POST', `${apiUrl}/auth/login`, {
            email,
            password
         }).then((response) => {
            token = response.body.token
         })
      })
   })

   it('should create a new task', () => {
      cy.request({
         method: 'POST',
         url: `${apiUrl}/tasks`,
         headers: { Authorization: `Bearer ${token}` },
         body: {
            title: 'Nova Task',
            description: 'Descrição da task',
            status: 'pending'
         }
      }).then((response) => {
         expect(response.status).to.eq(201)
         // Salva o id para os próximos testes
         cy.wrap(response.body.id).as('taskId')
         taskId = response.body.id
      })
   })

   it('should list all tasks', () => {
      cy.request({
         method: 'GET',
         url: `${apiUrl}/tasks`,
         headers: { Authorization: `Bearer ${token}` }
      }).then((response) => {
         expect(response.status).to.eq(200)
         expect(response.body.tasks).to.be.an('array')
      })
   })

   it('should update a task', () => {
      cy.request({
         method: 'PUT',
         url: `${apiUrl}/tasks/${taskId}`,
         headers: { Authorization: `Bearer ${token}` },
         body: {
            title: 'Task Atualizada',
            description: 'Descrição atualizada',
            status: 'completed'
         }
      }).then((response) => {
         expect(response.status).to.eq(200)
      })
   })

   it('should delete a task', () => {
      cy.request({
         method: 'DELETE',
         url: `${apiUrl}/tasks/${taskId}`,
         headers: { Authorization: `Bearer ${token}` }
      }).then((response) => {
         expect(response.status).to.eq(200)
      })
   })
})
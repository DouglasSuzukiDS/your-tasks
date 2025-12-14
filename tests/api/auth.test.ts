import { } from 'cypress'
describe('Auth API', () => {
   const apiUrl = '/api/auth';

   it('should register a new user', () => {
      cy.request('POST', `${apiUrl}/register`, {
         name: 'Test User',
         email: `testuser_${Date.now()}@mail.com`,
         password: 'testpassword'
      }).then((response) => {
         expect(response.status).to.eq(201);
      });
   });

   it('should login with valid credentials', () => {
      const email = `testlogin_${Date.now()}@mail.com`;
      const password = 'testpassword';

      // Register first
      cy.request('POST', `${apiUrl}/register`, {
         name: 'Login User',
         email,
         password
      }).then(() => {
         // Then login
         cy.request('POST', `${apiUrl}/login`, {
            email,
            password
         }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
         });
      });
   });

   it('should validate if user exists', () => {
      const email = `testvalidate_${Date.now()}@mail.com`;
      const password = 'testpassword';

      // Register first
      cy.request('POST', `${apiUrl}/register`, {
         name: 'Validate User',
         email,
         password
      }).then(() => {
         // Then validate
         cy.request('POST', `${apiUrl}/validate`, {
            email
         }).then((response) => {
            expect(response.status).to.eq(200);
         });
      });
   });

   it('should not login with invalid credentials', () => {
      cy.request({
         method: 'POST',
         url: `${apiUrl}/login`,
         body: {
            email: 'invalid@mail.com',
            password: 'wrongpassword'
         },
         failOnStatusCode: false
      }).then((response) => {
         expect(response.status).to.eq(404);
      });
   });
});
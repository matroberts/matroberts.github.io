#lang scheme
(require r5rs)
(require (planet "main.ss" ("schematics" "schemeunit.plt" 3 4)))

; memeber? - takes 2 arguments.  
; returns true if e is in the list lst, otherwise returns false
(define member?
  (lambda(e lst)
    (cond
      ((null? lst) #f)
      ((eq? e (car lst)) #t)
      (else (member? e (cdr lst))))))

(test-case "member tests"
  (check-false (member? 'a '()))
  (check-true  (member? 'a '(a)))
  (check-false (member? 'x '(a b c d)))
  (check-true  (member? 'd '(a b c d)))
)

; insert-right - takes 3 arguments, new, old and lst.
; inserts new into lst to the right of the first occurance of old
(define insert-right
  (lambda (new old lst)
    (cond
      ((null? lst) '())
      ((eq? old (car lst)) (cons old (cons new (cdr lst))))
      (else (cons (car lst) (insert-right new old (cdr lst)))))))

(test-case "insert-right tests"
  (check-equal? (insert-right 'x 'a '())
                '())
  (check-equal? (insert-right 'x 'a '(a))
                '(a x))
  (check-equal? (insert-right 'x 'c '(a b c))
                '(a b c x))
  (check-equal? (insert-right 'x 'a '(a a a))
                '(a x a a))
)

; any? - takes a list of booleans as an argument
; returns true if any are true, otherwise returns false
(define any?
  (lambda (lst)
    (cond
      ((null? lst) #f)
      ((car lst) #t)
      (else (any? (cdr lst))))))

(test-case "any? test"
  (check-false (any? '()))
  (check-true (any? '(#t)))
  (check-false (any? '(#f)))
  (check-true (any? '(#f #f #f #f #t)))
  (check-false (any? '(#f #f #f #f #f)))
)

; reject - takes two arguments a predicate test? and a list lst 
; returns a new list of items which fail test?
(define reject
  (lambda (test? lst)
    (cond
      ((null? lst) '())
      ((test? (car lst)) (reject test? (cdr lst)))
      (else (cons (car lst) (reject test? (cdr lst)))))))

(test-case "reject test"
  (check-equal? (reject even? '()) '())
  (check-equal? (reject even? '(2 2 2 2)) '())
  (check-equal? (reject even? '(1 1 1 1)) '(1 1 1 1))
  (check-equal? (reject even? '(1 2 3 4 5 6 7)) '(1 3 5 7))
  (check-equal? (reject positive? '(1 -1 2 -2 3 -3 4 -4 -5)) '(-1 -2 -3 -4 -5))
)